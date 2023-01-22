-- Host: classmysql.engr.oregonstate.edu    Database: cs340_seod
-- ------------------------------------------------------
-- Server version	10.6.7-MariaDB-log MariaDB Server

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

SET foreign_key_checks = 0;

-- 
-- Table Structure for 'Passenger' Table
--

DROP TABLE IF EXISTS `Passenger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Passenger` (
    `accountID` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(100) NOT NULL,
    `last_name` varchar(100) NOT NULL,
    -- `flightID` int(11),
    PRIMARY KEY(`accountID`),
    UNIQUE(`accountID`)
);

--
-- Dumping data for table `Passenger`
-- Comment: For the flightID value do we enter a value like '2', or do we just write 'flightID' since it's a refernce???
--

-- LOCK TABLES `Passenger` WRITE;
/*!40000 ALTER TABLE `Passenger` DISABLE KEYS */;
INSERT INTO `Passenger` VALUES (1, 'Daniel', 'Seo'), (2, 'Max', 'Fu'), (3, 'Donald', 'Duck'), (4, 'Keanu', 'Reeves'), (5, 'Lebron', 'James'), (6, 'Linus', 'Pauling');
/*!40000 ALTER TABLE `Passenger` ENABLE KEYS */;
-- UNLOCK TABLES;

-- 
-- Table Structure for 'Plane' Table
-- Comment: Should `airports` be an FK referencing Airport's `name`???
--

DROP TABLE IF EXISTS `Plane`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Plane` (
    `modelID` int(11) NOT NULL AUTO_INCREMENT,
    `airports` varchar(100) NOT NULL,
    `type` varchar(100) NOT NULL,
    UNIQUE(modelID),
    PRIMARY KEY(`modelID`),
    CONSTRAINT `plane_ibfk_1` FOREIGN KEY(`airports`) REFERENCES `Airport`(`name`)
	ON UPDATE CASCADE
    ON DELETE CASCADE
);

--
-- Dumping data for table `Plane`
-- Comment: Same reference issue as in 'Passenger'....
--

-- LOCK TABLES `Plane` WRITE;
/*!40000 ALTER TABLE `Plane` DISABLE KEYS */;
INSERT INTO `Plane` VALUES (100, 'Portland International Airport', 'Turbopop'), (101, 'Los Angeles International Airport', 'Piston'), (103, 'Seattle-Tacoma International Airport', 'Commuter Liner'), (104, 'Incheon International Airport', 'Airbus'), (105, 'Narita International Airport', 'Commuter Liner');
/*!40000 ALTER TABLE `Plane` ENABLE KEYS */;
-- UNLOCK TABLES;

-- 
-- Table Structure for 'City' Table
--

DROP TABLE IF EXISTS `City`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `City` (
    `name` varchar(255) NOT NULL,
    `location` varchar(100) NOT NULL,
    UNIQUE(`name`,`location`),
    PRIMARY KEY(`name`,`location`)
);

--
-- Dumping data for table `City`
--

-- LOCK TABLES `City` WRITE;
/*!40000 ALTER TABLE `City` DISABLE KEYS */;
INSERT INTO `City` VALUES ('Portland', 'Oregon'), ('Los Angeles', 'California'), ('Seattle', 'Washington'), ('Incheon', 'South Korea'), ('Tokyo', 'Japan');
/*!40000 ALTER TABLE `City` ENABLE KEYS */;
-- UNLOCK TABLES;

-- 
-- Table Structure for 'Airport' Table
--

DROP TABLE IF EXISTS `Airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Airport` (
    `name` varchar(255) NOT NULL,
    `location` varchar(100) NOT NULL,
    PRIMARY KEY(`name`),
    UNIQUE(`name`),
    CONSTRAINT `Airport_ibfk_1` FOREIGN KEY(`location`) REFERENCES `City`(`name`)
	ON UPDATE CASCADE
    ON DELETE CASCADE	
);

--
-- Dumping data for table `Airport`
-- Same issue with placing the value for location as in 'Passenger' since its an FK reference...
--

-- LOCK TABLES `Airport` WRITE;
/*!40000 ALTER TABLE `Airport` DISABLE KEYS */;
INSERT INTO `Airport` VALUES ('Portland International Airport', 'Portland'), ('Los Angeles International Airport', 'Los Angeles'), ('Seattle-Tacoma International Airport', 'Seattle'), ('Incheon International Airport', 'Incheon'), ('Narita International Airport', 'Tokyo');
/*!40000 ALTER TABLE `Airport` ENABLE KEYS */;
-- UNLOCK TABLES;

-- 
-- Table Structure for 'Flight' Table'
-- Comment: Are 'from' and 'to' FKs referencing the City's 'name'???
--

DROP TABLE IF EXISTS `Flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Flight` (
    `flightID` int(11) NOT NULL AUTO_INCREMENT,
    `'from'` varchar(100) NOT NULL,
    `'to'` varchar(100) NOT NULL,
    `eta` int(11) NOT NULL,
    -- `passengers` int(11) NOT NULL,
    PRIMARY KEY(`flightID`),
    UNIQUE(`flightID`)
);

--
-- Dumping data for table `Flight`
-- Same issue with placing the value for location as in 'Passenger' since its an FK reference...
--

-- LOCK TABLES `Flight` WRITE;
/*!40000 ALTER TABLE `Flight` DISABLE KEYS */;
INSERT INTO `Flight` VALUES (200, 'Portland', 'Los Angeles', 90), (201, 'Los Angeles', 'Seattle', 120), (202, 'Seattle', 'Incheon', 780), (203, 'Incheon', 'Tokyo', 150), (204, 'Tokyo', 'Portland', 840);
/*!40000 ALTER TABLE `Flight` ENABLE KEYS */;
-- UNLOCK TABLES;

-- 
-- Table Structure for 'Flight_Passenger' Table'
--

DROP TABLE IF EXISTS `Flight_Passenger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Flight_Passenger` (
    `flightID` int(11) NOT NULL,
    `accountID` int(11) NOT NULL,
UNIQUE(`flightID`,`accountID`),
    CONSTRAINT `Flight_Passenger_ibfk_1` FOREIGN KEY(`flightID`) REFERENCES `Flight`(`flightID`),
    CONSTRAINT `Flight_Passenger_ibfk_2` FOREIGN KEY(`accountID`) REFERENCES `Passenger`(`accountID`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

--
-- Dumping data for table `Flight_Passenger`
--

-- LOCK TABLES `Flight_Passenger` WRITE;
/*!40000 ALTER TABLE `Flight_Passenger` DISABLE KEYS */;
INSERT INTO `Flight_Passenger`(flightID,accountID) VALUES ((SELECT flightID FROM `Flight` WHERE Flight.flightID = 200),(SELECT accountID FROM `Passenger` WHERE Passenger.accountID = 1));
INSERT INTO `Flight_Passenger`(flightID,accountID) VALUES ((SELECT flightID FROM `Flight` WHERE Flight.flightID = 201),(SELECT accountID FROM `Passenger` WHERE Passenger.accountID = 1));
/*!40000 ALTER TABLE `Flight_Passenger` ENABLE KEYS */;
-- UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


