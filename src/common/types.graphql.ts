import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => Int, { defaultValue: 20, nullable: true })
  limit?: number;
}

@ObjectType()
export class Pagination<T> {
  @Field(() => Int)
  total!: number;
}

@ObjectType()
export class BaseResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
