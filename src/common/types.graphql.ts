import { Field, InputType, ObjectType, Int, Directive } from "@nestjs/graphql";

@ObjectType()
export class PaginationBase {
  @Field(() => Int)
  total!: number;
}

@ObjectType()
@Directive("@shareable")
export class BaseResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
