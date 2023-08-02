import { ARROW } from "../utils/constants";
import DishCard from "./DishCard";
import NestedRestaurantSection from "./NestedRestaurantSection";
export default function RestaurantSection({
  items,
  visibleSection,
  toggleMenuSection,
  restaurantInfo,
}) {
  function toggleSection(name) {
    toggleMenuSection(name);
  }
  return (
    <section className="w-3/4 m-auto">
      <p
        className={`text-lg flex flex-row justify-between m-3 mr-10 cursor-pointer ${
          visibleSection[items.title]
            ? "border border-transparent border-b-red-700 border-4"
            : ""
        }`}
        onClick={() => toggleSection(items.title)}
      >
        {items.title}
        <img
          src={ARROW}
          alt="arrow"
          className={
            visibleSection[items.title]
              ? "rotate-180 transition-transform duration-200 h-4 w-4"
              : "transition-transform duration-200 w-4 h-4"
          }
        />
      </p>
      {items.categories && visibleSection[items.title] && (
        <NestedRestaurantSection
          dishes={items.categories}
          restaurantInfo={restaurantInfo}
        />
      )}
      {items.itemCards && visibleSection[items.title] && (
        <div>
          {items.itemCards.map((el) => {
            return (
              <DishCard
                dish={el.card.info}
                key={el.card.info.id}
                restaurantInfo={restaurantInfo}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
