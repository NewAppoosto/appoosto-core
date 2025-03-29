import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  page!: number;

  @Field(() => Int, { defaultValue: 20, nullable: true })
  limit!: number;

  @Field(() => String, { nullable: true })
  search!: string;
}
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(SortOrder, {
  name: "SortOrder",
  description: "Sort order",
});

@InputType()
export class SortInput {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => SortOrder, { nullable: true })
  order?: SortOrder;
}
