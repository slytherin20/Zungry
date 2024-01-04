import { Link } from "react-router-dom";
export default function AddressView({ profileDetails }) {
  return (
    profileDetails && (
      <section className="sm:w-2/4 p-2 flex flex-col items-center sm:items-start">
        <h1 className="font-bold text-lg w-2/4 m-3">Billing Address</h1>
        <p className="m-3">{profileDetails.address}</p>
        <p className="m-3">Mobile No.: {profileDetails.mobile}</p>
        <Link to="/account">
          <button
            type="button"
            className="w-48 bg-red-700 text-white rounded-md"
          >
            Edit Address
          </button>
        </Link>
      </section>
    )
  );
}
