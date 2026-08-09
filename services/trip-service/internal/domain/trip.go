package domain

import (
	"context"
	"ride-sharing/shared/types"

	tripTypes "ride-sharing/services/trip-service/pkg/types"
	pbd "ride-sharing/shared/proto/driver"
	pb "ride-sharing/shared/proto/trip"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TripModel struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	UserID   string             `bson:"userID"`
	Status   string             `bson:"status"`
	RideFare *RideFareModel     `bson:"rideFare"`
	Driver   *pb.TripDriver     `bson:"driver"`
}

func (t *TripModel) ToProto() *pb.Trip {
	if t == nil {
		return nil
	}

	var selectedFare *pb.RideFare
	var route *pb.Route

	if t.RideFare != nil {
		selectedFare = t.RideFare.ToProto()
		if t.RideFare.Route != nil {
			route = t.RideFare.Route.ToProto()
		}
	}

	return &pb.Trip{
		Id:           t.ID.Hex(),
		UserID:       t.UserID,
		SelectedFare: selectedFare,
		Status:       t.Status,
		Driver:       t.Driver,
		Route:        route,
	}
}

type TripRepository interface {
	CreateTrip(ctx context.Context, trip *TripModel) (*TripModel, error)
	SaveRideFare(ctx context.Context, f *RideFareModel) error
	GetRideFareByID(ctx context.Context, id string) (*RideFareModel, error)
	GetTripByID(ctx context.Context, id string) (*TripModel, error)
	UpdateTrip(ctx context.Context, tripID string, status string, driver *pbd.Driver) error
}

type TripService interface {
	CreateTrip(ctx context.Context, fare *RideFareModel) (*TripModel, error)
	GetRoute(ctx context.Context, pickup, destination *types.Coordinate, useOsrmApi bool) (*tripTypes.OsrmApiResponse, error)
	EstimatePackagesPriceWithRoute(route *tripTypes.OsrmApiResponse) []*RideFareModel
	GenerateTripFares(
		ctx context.Context,
		fares []*RideFareModel,
		userID string,
		Route *tripTypes.OsrmApiResponse,
	) ([]*RideFareModel, error)
	GetAndValidateFare(ctx context.Context, fareID, userID string) (*RideFareModel, error)
	GetTripByID(ctx context.Context, id string) (*TripModel, error)
	UpdateTrip(ctx context.Context, tripID string, status string, driver *pbd.Driver) error
}
