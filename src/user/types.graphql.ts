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

@ObjectType({ description: "Company details", isAbstract: true })
@Directive('@key(fields: "id")')
@Directive("@extends")
export class CompanyDetails {
  @Field(() => ID)
  @Directive("@external")
  id!: string;

  @Field({ description: "Company name" })
  @Directive("@external")
  name!: string;

  @Field({ description: "Legal address of the company" })
  @Directive("@external")
  legal_address!: string;

  @Field({ description: "VAT number of the company" })
  @Directive("@external")
  vat_number!: string;
}

@ObjectType({ description: "User details" })
@Directive('@key(fields: "id")')
@Directive("@extends")
@Directive("@shareable")
export class UserDetails implements IUserDetails {
  @Field(() => ID)
  @Directive("@shareable")
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
}
