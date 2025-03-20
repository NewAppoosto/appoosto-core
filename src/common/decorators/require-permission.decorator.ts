import {
  ExecutionContext,
  Inject,
  SetMetadata,
  UseGuards,
  Injectable,
  applyDecorators,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { ErrorTypes, MessagePatternQueue } from "../../constants";
import { AsyncMethod, ApiError } from "../../utils";

// Create metadata key for the permission requirements
export const PERMISSION_KEY = "permissions";
export interface PermissionMetadata {
  microserviceName: string;
  permissionName: string;
}

// Decorator to set metadata
export const RequirePermission = (
  microserviceName: string,
  permissionName: string
) => {
  return SetMetadata(PERMISSION_KEY, { microserviceName, permissionName });
};

// Combined decorator that includes both UseGuards and RequirePermission
export const CheckPermission = (
  microserviceName: string,
  permissionName: string
) => {
  return applyDecorators(
    UseGuards(PermissionGuard),
    RequirePermission(microserviceName, permissionName)
  );
};

// Injectable guard that will handle the permission check
@Injectable()
export class PermissionGuard {
  constructor(
    @Inject("AUTHORIZATION_SERVICE") private authorizationClient: ClientProxy
  ) {}

  @AsyncMethod()
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the metadata
    const reflector = Reflect.getMetadata(PERMISSION_KEY, context.getHandler());
    if (!reflector) return true;

    const { microserviceName, permissionName } = reflector;

    // For GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().user;

    if (!user) {
      throw new ApiError("User context not found", ErrorTypes.UN_AUTHORIZED);
    }

    const hasAccess = await lastValueFrom(
      this.authorizationClient.send(MessagePatternQueue.permissionCheck, {
        user,
        microserviceName,
        permissionName,
      })
    );

    if (!hasAccess) {
      throw new ApiError(
        `Permission denied: ${permissionName} for ${microserviceName}`,
        ErrorTypes.UN_AUTHORIZED
      );
    }

    return true;
  }
}
