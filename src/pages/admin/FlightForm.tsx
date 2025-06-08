import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { type FlightData } from "../../types/flightTypes";

interface Props {
  onSubmit: (flight: FlightData) => void;
  initialData?: FlightData | null;
  setEditingFlight: (flight: FlightData | null) => void;
}

const FlightForm: React.FC<Props> = ({
  onSubmit,
  initialData,
  setEditingFlight,
}) => {
  const formik = useFormik<FlightData>({
    initialValues: {
      id: initialData?.id || "",
      from: initialData?.from || "",
      to: initialData?.to || "",
      departure: initialData?.departure || "",
      arrival: initialData?.arrival || "",
      airline: initialData?.airline || "",
      price: initialData?.price || 0,
      seatsAvailable: initialData?.seatsAvailable || 50,
      seatsBooked: initialData?.seatsBooked || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      from: Yup.string().required("Required"),
      to: Yup.string().required("Required"),
      departure: Yup.string().required("Required"),
      arrival: Yup.string().required("Required"),
      airline: Yup.string().required("Required"),
      price: Yup.number().required("Required").min(0),
      seatsAvailable: Yup.number().min(0).required("Required"),
      seatsBooked: Yup.number().min(0).required("Required"),
    }),
    onSubmit: (values) => {
      const flight: FlightData = {
        ...values,
        id: initialData
          ? values.id
          : `${values.from}-${values.to}-${Date.now()}`,
      };
      onSubmit(flight);
      formik.resetForm();
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
    >
      <input
        name="from"
        placeholder="From"
        value={formik.values.from}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        name="to"
        placeholder="To"
        value={formik.values.to}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        type="datetime-local"
        name="departure"
        value={formik.values.departure}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        type="datetime-local"
        name="arrival"
        value={formik.values.arrival}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        name="airline"
        placeholder="Airline"
        value={formik.values.airline}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formik.values.price}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        type="number"
        name="seatsAvailable"
        placeholder="Seats Available"
        value={formik.values.seatsAvailable}
        onChange={formik.handleChange}
        className="input"
      />
      <input
        type="number"
        name="seatsBooked"
        placeholder="Seats Booked"
        value={formik.values.seatsBooked}
        onChange={formik.handleChange}
        className="input"
      />
      <div className="col-span-2 flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Flight" : "Add Flight"}
        </button>
        {initialData && (
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => setEditingFlight(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default FlightForm;
