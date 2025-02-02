
const Event = require('../../models/event');
const Booking = require('../../models/booking');
// const booking = require('../../models/booking');

const {transformBooking, transformEvent}  = require('./merge')




module.exports = {
  bookings: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthenicated');
    }
    try{
      const bookings = await Booking.find({user: req.userId})
      return bookings.map(booking =>{
        return transformBooking(booking);
      })
    }catch(err){
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthenicated');
    }
    const fetchEvent = await Event.findOne({_id: args.eventId})
    const booking = new Booking({
      user: req.userId,
      event: fetchEvent

    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthenicated');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};