import { useEffect, useState } from 'react';
import { WEBSOCKET_URL } from "../constants";
import { Trip, Driver, CarPackageSlug } from '../types';
import { ServerWsMessage, TripEvents, isValidWsMessage, isValidTripEvent, ClientWsMessage, BackendEndpoints } from '../contracts';

interface useDriverConnectionProps {
  location: {
    latitude: number;
    longitude: number;
  };
  geohash: string;
  userID: string;
  packageSlug: CarPackageSlug;
}

export const useDriverStreamConnection = ({
  location,
  geohash,
  userID,
  packageSlug
}: useDriverConnectionProps) => {
  const [requestedTrips, setRequestedTrips] = useState<Trip[]>([]);
  const [tripStatus, setTripStatus] = useState<TripEvents | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);

  const requestedTrip = requestedTrips[0] || null;

  useEffect(() => {
    if (!userID) return;

    const websocket = new WebSocket(`${WEBSOCKET_URL}${BackendEndpoints.WS_DRIVERS}?userID=${userID}&packageSlug=${packageSlug}`);
    setWs(websocket);

    websocket.onopen = () => {
      if (location) {
        // Send initial location
        websocket.send(JSON.stringify({
          type: TripEvents.DriverLocation,
          data: {
            location,
            geohash,
          }
        }));
      }
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerWsMessage;

      if (!message || !isValidWsMessage(message)) {
        setError(`Unknown message type "${message}", allowed types are: ${Object.values(TripEvents).join(', ')}`);
        return;
      }

      switch (message.type) {
        case TripEvents.DriverTripRequest:
          const trip = (message.data?.trip) ?? message.data;
          if (trip) {
            const rawTrip = trip as unknown as Record<string, string>;
            const tripID = trip.id || rawTrip?.tripID;
            if (tripID) {
              setRequestedTrips((prev) => {
                if (prev.some((t) => (t.id || (t as unknown as Record<string, string>)?.tripID) === tripID)) {
                  return prev;
                }
                return [...prev, trip];
              });
              setTripStatus(TripEvents.DriverTripRequest);
            }
          }
          break;
        case TripEvents.DriverRegister:
          const driverData = (message.data as unknown as { driver?: Driver })?.driver ?? (message.data as Driver);
          setDriver(driverData);
          break;
      }


      if (isValidTripEvent(message.type)) {
        if (message.type !== TripEvents.DriverTripRequest) {
          setTripStatus(message.type);
        }
      } else {
        setError(`Unknown message type "${message.type}", allowed types are: ${Object.values(TripEvents).join(', ')}`);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket closed');
    };

    websocket.onerror = (event) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', event);
    };

    return () => {
      console.log('Closing WebSocket');
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  const sendMessage = (message: ClientWsMessage) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      setError('WebSocket is not connected');
    }
  };

  const resetTripStatus = () => {
    setRequestedTrips((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        setTripStatus(null);
      } else {
        setTripStatus(TripEvents.DriverTripRequest);
      }
      return next;
    });
  };

  return {
    error,
    tripStatus,
    driver,
    requestedTrip,
    requestedTrips,
    pendingCount: requestedTrips.length,
    resetTripStatus,
    sendMessage,
    setTripStatus
  };
}
