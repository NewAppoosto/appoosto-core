import {
  ExecutionContext,
  Inject,
  SetMetadata,
  UseGuards,
  Injectable,
  applyDecorators,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { ErrorTypes, MessagePatternQueue } from "../../constants";
import { AsyncMethod, ApiError } from "../../utils";
import { RequestWithUser } from "../../user/interfaces";
// Create metadata key for the permission requirements
export const CONTROLLER_PERMISSION_KEY = "controller_permissions";
export interface ControllerPermissionMetadata {
  microserviceName: string;
  permissionName: string;
}

// Decorator to set metadata
export const RequireControllerPermission = (
  microserviceName: string,
  permissionName: string
) => {
  return SetMetadata(CONTROLLER_PERMISSION_KEY, {
    microserviceName,
    permissionName,
  });
};

// Combined decorator that includes both UseGuards and RequireControllerPermission
export const CheckControllerPermission = (
  microserviceName: string,
  permissionName: string
) => {
  return applyDecorators(
    UseGuards(ControllerPermissionGuard),
    RequireControllerPermission(microserviceName, permissionName)
  );
};

// Injectable guard that will handle the permission check
@Injectable()
export class ControllerPermissionGuard {
  constructor(
    @Inject("AUTHORIZATION_SERVICE") private authorizationClient: ClientProxy
  ) {}

  @AsyncMethod()
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the metadata
    const reflector = Reflect.getMetadata(
      CONTROLLER_PERMISSION_KEY,
      context.getHandler()
    );
    if (!reflector) return true;

    const { microserviceName, permissionName } = reflector;

    // Get the request object from the context
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("User context not found");
    }

    const hasAccess = await lastValueFrom(
      this.authorizationClient.send(MessagePatternQueue.permissionCheck, {
        user,
        microserviceName,
        permissionName,
      })
    );

    if (!hasAccess) {
      throw new UnauthorizedException(
        `Permission denied: ${permissionName} for ${microserviceName}`
      );
    }

    return true;
  }
}
