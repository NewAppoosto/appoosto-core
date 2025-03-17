import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "User Profile" })
export class UserProfile {
  @Field(() => ID)
  id!: string;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;

  @Field({
    nullable: true,
    description:
      "User ID. This comes from user microservice at the time of registration.",
  })
  user_id?: string;

  @Field({ description: "First name of the user" })
  first_name!: string;

  @Field({ description: "Last name of the user" })
  last_name!: string;

  @Field({
    nullable: true,
    description: "Profile photo of the user. It will just store the image url.",
  })
  profile_photo?: string;

  @Field({
    nullable: true,
    description: "Cover photo of the user. It will just store the image url.",
  })
  cover_photo?: string;

  @Field({
    nullable: true,
    description:
      "Phone number of the user. It is required for phone verification.",
  })
  phone_number?: string;
}
