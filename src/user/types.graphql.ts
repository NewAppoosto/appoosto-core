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
  @Directive("@shareable")
  username!: string;

  @Field({ description: "Email of the user. It have to be unique" })
  @Directive("@shareable")
  email!: string;

  @Field({ defaultValue: false })
  @Directive("@shareable")
  is_google_connected!: boolean;

  @Field({ defaultValue: false })
  @Directive("@shareable")
  is_github_connected!: boolean;

  @Field({ defaultValue: false })
  @Directive("@shareable")
  is_linked_in_connected!: boolean;

  @Field({ defaultValue: false })
  @Directive("@shareable")
  twofa_enabled!: boolean;

  @Field(() => Date)
  @Directive("@shareable")
  created_at!: Date;

  @Field(() => Date)
  @Directive("@shareable")
  updated_at!: Date;

  @Field({
    description: "First name of the user",
  })
  @Directive("@shareable")
  first_name!: string;

  @Field({
    description: "Last name of the user",
  })
  @Directive("@shareable")
  last_name!: string;

  @Field({
    defaultValue: "",
    nullable: true,
    description: "Profile photo of the user. It will just store the image url.",
  })
  @Directive("@shareable")
  profile_photo?: string;

  @Field({
    defaultValue: "",
    nullable: true,
    description: "Cover photo of the user. It will just store the image url.",
  })
  @Directive("@shareable")
  cover_photo?: string;

  @Field({
    nullable: true,
    description:
      "Phone number of the user. It is required for phone verification.",
  })
  @Directive("@shareable")
  phone_number?: string;

  @Field({
    nullable: true,
    description:
      "Google id of the user. This field is required if is_google_connected is true. Google id is unique for every user in google and this value will be added at the time of connecting with google",
  })
  @Directive("@shareable")
  google_id?: string;

  @Field({
    nullable: true,
    description:
      "Github id of the user. This value is used in order to determine if this account has been used in another account or not",
  })
  @Directive("@shareable")
  github_id?: string;

  @Field({
    nullable: true,
    description:
      "Linkedin id of the user. This value is used in order to determine if this account has been used in another account or not",
  })
  @Directive("@shareable")
  linked_in_id?: string;
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
