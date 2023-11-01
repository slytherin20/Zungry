import { Link } from "react-router-dom";
export default function AddressView({ profileDetails }) {
  return (
    profileDetails && (
      <section className="w-2/4">
        <h1 className="font-bold text-lg w-2/4">Billing Address</h1>
        <p>{profileDetails.address}</p>
        <p>Mobile No.: {profileDetails.mobile}</p>
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
