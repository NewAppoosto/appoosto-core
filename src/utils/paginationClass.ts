import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationBase } from "../graphql";

export function PaginatedResponse<TItem>(TItemClass: new () => TItem) {
  // Get the name of the item class to create a unique name for the paginated class
  const className = TItemClass.name;
  @ObjectType(`Paginated${className}`)
  abstract class PaginatedResponseClass extends PaginationBase {
    @Field(() => [TItemClass])
    nodes!: TItem[];
  }
  return PaginatedResponseClass;
}
