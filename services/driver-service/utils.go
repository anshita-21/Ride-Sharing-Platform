package main

import "math/rand"

// Predefined routes for drivers (used for the gRPC Streaming module)
// (these are San Francisco routes, get these coordinates from Google Maps for example and build a custom route if you want)
var PredefinedRoutes = [][][]float64{
	{
		{12.9121, 77.6846},
		{12.9150, 77.6870},
		{12.9180, 77.6900},
		{12.9210, 77.6930},
	},
	{
		{12.9100, 77.6820},
		{12.9130, 77.6850},
		{12.9160, 77.6880},
		{12.9190, 77.6910},
	},
	{
		{12.9140, 77.6890},
		{12.9170, 77.6920},
		{12.9200, 77.6950},
		{12.9230, 77.6980},
	},
	{
		{12.9090, 77.6800},
		{12.9110, 77.6830},
		{12.9140, 77.6860},
		{12.9170, 77.6890},
	},
}

func GenerateRandomPlate() string {
	letters := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	plate := ""
	for i := 0; i < 3; i++ {
		plate += string(letters[rand.Intn(len(letters))])
	}

	return plate
}