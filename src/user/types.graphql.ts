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
}
