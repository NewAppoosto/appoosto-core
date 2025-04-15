import {
  Directive,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { IUserDetails } from "./interfaces";

/**
 * Invitation Status Enum
 */
export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Register the enum with GraphQL
registerEnumType(InvitationStatus, {
  name: "InvitationStatus",
  description: "Status of an invitation",
});

@ObjectType({ description: "Company details" })
@Directive('@key(fields: "id")')
@Directive("@shareable")
export class CompanyDetails {
  @Field(() => ID)
  id!: string;

  @Field({ description: "Company name" })
  name!: string;

  @Field({ description: "Legal address of the company" })
  legal_address!: string;

  @Field({ description: "VAT number of the company" })
  vat_number!: string;
}

@ObjectType({ description: "User details" })
@Directive('@key(fields: "id")')
@Directive("@shareable")
export class UserDetails implements IUserDetails {
  @Field(() => ID)
  id!: string;

  @Field({
    description:
      "Username of the user. Unique username for every user is required",
  })
  username!: string;

  @Field({ description: "Email of the user. It have to be unique" })
  email!: string;

  @Field({ defaultValue: false })
  is_google_connected!: boolean;

  @Field({ defaultValue: false })
  is_github_connected!: boolean;

  @Field({ defaultValue: false })
  is_linked_in_connected!: boolean;

  @Field({ defaultValue: false })
  twofa_enabled!: boolean;
}

@ObjectType()
@Directive('@key(fields: "id")')
@Directive("@shareable")
export class NotificationDetails {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  message!: string;

  @Field(() => String)
  action_url!: string;

  @Field(() => String)
  type!: string;

  @Field(() => String)
  status!: string;

  @Field(() => Date)
  expires_at!: Date;

  @Field(() => String)
  company_id!: string;

  @Field(() => String)
  user_id!: string;
}
