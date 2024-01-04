export default function RestaurantDetailsShimmer() {
  return (
    <div>
      <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
        <div className="h-52 w-64 sm:h-64 sm:w-80 bg-gray-400"></div>
        <div className="w-2/5 sm:w-2/3 p-2">
          <p className="h-9 sm:w-52 bg-gray-400"></p>
          <p className="h-4 w-3/4 my-4 bg-gray-400"></p>
          <p className="h-4 w-3/4 my-4 bg-gray-400"></p>
          <p className="h-4 w-14 my-4 bg-gray-400"></p>
          <p className="h-4 w-2/4 my-4 bg-gray-400"></p>
        </div>
      </div>
      <div className="m-4">
        <p className="h-6 bg-gray-400 w-16"></p>
        {[1, 1, 1, 1, 1, 1, 1].map((el, index) => (
          <div
            className="w-full flex justify-between m-3 bg-gray-100 items-center"
            key={index}
          >
            <div className="p-1">
              <p className="h-5 w-28 my-10 bg-gray-400"></p>
              <p className="h-4 w-12 my-5 bg-gray-400"></p>
              <p className="h-3 sm:w-52 my-5 bg-gray-400"></p>
            </div>
            <div className="w-28 h-28 bg-gray-400"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
