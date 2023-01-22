SELECT accountID, first_name, last_name FROM Passenger

SELECT modelID, airports, `type` FROM Plane

SELECT name, location FROM City

SELECT name, location FROM Airport

SELECT flightID, from, to, eta, passengers FROM Flight 

SELECT flightID, accountID FROM Flight_Passenger

INSERT INTO Passengers (accountID, first_name, last_name, flightID) 
VALUES (:PIDInput, :fNameInput, :lNameInput, :flightIDInput)

INSERT INTO Plane (modelID, airports, type)
VALUES (:MIDInput, :airportInput, :typeInput)

INSERT INTO City (name, location)
VALUES (:cNameInput, :cLocationInput)

INSERT INTO Airport (name, location)
VALUES (:aNameInput, :aLoationInput)

INSERT INTO Flight (flightID, from, to, eta, passengers)
VALUES (:FIDInput, :fromInput, :toInput, :etaInput, :passengerInput)

INSERT INTO Flight_Passenger (flightID, accountID)
VALUES (:fidInput, :pidInput)

DELETE FROM Passenger WHERE Passenger.accountID = :PIDInput

DELETE FROM Flight WHERE Flight.flightID = :FIDInput

DELETE FROM Plane WHERE Plane.modelID = :MIDInput

DELETE FROM Airport WHERE Airport.name = :aNameInput

DELETE FROM City WHERE City.name = :cNameInput

DELETE FROM Flight_Passenger WHERE Flight_Passenger.accountID = :pidInput AND Flight_Passenger.flightID = :fidInput

UPDATE Passenger SET first_name = :fNameInput, last_name = :lNameInput, flightID = :flightIDInput WHERE accountID = :PIDInput

UPDATE Flight SET from = :fromInput, to = :toInput, eta = :etaInput, passengers = :passengerInput WHERE flightID = :FIDInput

INSERT INTO Flight_Passenger (flightId, accountID)
VALUES (:listOfFlightIDs, :listOfAccountIDs)


