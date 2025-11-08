const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI 
);


oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });


const createCalendarEvent = async (reservation, room, user) => {
  try {
    const event = {
      summary: `การจองห้อง: ${room.name}`,
      description: `ผู้จอง: ${user.name} (${user.email})`,
      start: {
        dateTime: reservation.startTime,
        timeZone: "Asia/Bangkok",
      },
      end: {
        dateTime: reservation.endTime,
        timeZone: "Asia/Bangkok",
      },
      attendees: [{ email: user.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const res = await calendar.events.insert({
      calendarId: "primary", 
      resource: event,
    });

    return res.data.id; 
  } catch (err) {
    console.error("Error creating calendar event:", err.message);
    return null;
  }
};

const updateCalendarEvent = async (eventId, updatedReservation) => {
  try {
    const res = await calendar.events.update({
      calendarId: "primary",
      eventId,
      resource: {
        start: { dateTime: updatedReservation.startTime, timeZone: "Asia/Bangkok" },
        end: { dateTime: updatedReservation.endTime, timeZone: "Asia/Bangkok" },
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating calendar event:", err.message);
    return null;
  }
};

const deleteCalendarEvent = async (eventId) => {
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    return true;
  } catch (err) {
    console.error("Error deleting calendar event:", err.message);
    return false;
  }
};

module.exports = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
