const db = require("../database/dbConfig");

const post = async (name, data) => {
  const [id] = await db(name).insert(data);
  return getFlights(id);
};
const get = async (name, id) => {
  if (id) {
    const data = await db(name)
      .where("id", id)
      .first();
    return data;
  }
  return await db(name);
};
const deleted = async (name, id) => {
  return await db(name)
    .where("id", id)
    .del();
};
const flightInfo = data => {
  const departure_location = getAirports(data.departure_airport_id);
  const arrival_location = getAirports(data.arrival_airport_id);
  return {
    ...data,
    departure_location,
    arrival_location
  };
};
const postAdminDetials = data => post("admins", data);
const getAdminsDetials = id => get("admins", id);
const deleteAdminDetails = id => deleted("admins", id);
const postFlight = data => post("flights", data);
const deleteFlight = id => deleted("flights", id);
const postAirport = data => post("airports", data);
const getAirports = id => get("airports", id);
const deleteAirport = id => deleted("airports", id);
const getFlights = async id => {
  let data;
  if (id) {
    data = await db("flights").where("id", id);
    return flightInfo(data);
  }
  data = await db("flights");
  return data.map(flight => flightInfo(flight));
};

const getAllusers = async id => {
  const data = await db("admins as ad")
    .select(
      "us.firstname",
      "us.lastname",
      "tr.no_of_kids",
      "fl.departure_time",
      "fl.arrival_time",
      "arr.user_location"
    )
    .join("trips as tr", "tr.admin_Id", "ad.id")
    .join("users as us", "us.id", "tr.user_id")
    .join("flights as fl", "fl.id", "tr.flight_id")
    .join("arrivals as arr", "arr.user_trip_id", "tr.id")
    .where("ad.id", id);
  return data;
};
module.exports = {
  postAdminDetials,
  getAdminsDetials,
  deleteAdminDetails,
  postFlight,
  getFlights,
  deleteFlight,
  postAirport,
  getAirports,
  deleteAirport,
  getAllusers
};
