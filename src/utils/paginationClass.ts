import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationBase } from "../graphql";

export function PaginatedResponse<TItem>(TItemClass: new () => TItem) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass extends PaginationBase {
    @Field(() => [TItemClass])
    nodes!: TItem[];
  }
  return PaginatedResponseClass;
}
