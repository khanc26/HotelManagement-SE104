-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: mysql-212c844a-jobify213-3836.f.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '29acf73e-05f5-11f0-8886-d69391db7c94:1-32,
44773add-2c4f-11f0-93d9-862ccfb0717e:1-1977,
fac76037-0fc0-11f0-b559-32ee9f9ef1a6:1-1426';

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` varchar(36) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `check_in_date` timestamp NULL DEFAULT NULL,
  `check_out_date` timestamp NULL DEFAULT NULL,
  `booker_id` varchar(36) DEFAULT NULL,
  `room_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ee97cceb057d5cf2edc0f0ac08` (`booker_id`),
  KEY `FK_e35dcb428979ee7cc7808440126` (`room_id`),
  CONSTRAINT `FK_4ee97cceb057d5cf2edc0f0ac08` FOREIGN KEY (`booker_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e35dcb428979ee7cc7808440126` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES ('61029d15-f234-4ac0-a5f8-cd70be659eda',1680000.00,'2025-06-22 22:57:11.000000','2025-06-22 22:57:11.000000',NULL,NULL,NULL,NULL,NULL),('7c4b8317-fc82-43f4-9af3-a7192c5cf3e5',450000.00,'2025-06-22 15:11:47.000000','2025-06-22 15:11:47.000000',NULL,NULL,NULL,NULL,NULL),('d3296635-edcf-40c4-9c52-84bd467345aa',1875000.00,'2025-06-22 15:11:55.000000','2025-06-22 15:11:55.000000',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_detail`
--

DROP TABLE IF EXISTS `booking_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_detail` (
  `id` varchar(36) NOT NULL,
  `guest_count` int NOT NULL,
  `has_foreigners` tinyint NOT NULL DEFAULT '0',
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `status` enum('pending','checked_in','checked_out','cancelled') NOT NULL DEFAULT 'pending',
  `approval_status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `booking_id` varchar(36) DEFAULT NULL,
  `room_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_detail`
--

LOCK TABLES `booking_detail` WRITE;
/*!40000 ALTER TABLE `booking_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_participant`
--

DROP TABLE IF EXISTS `booking_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_participant` (
  `booking_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`booking_id`,`user_id`),
  KEY `IDX_dc6b6e14d15e43eaed401afa05` (`booking_id`),
  KEY `IDX_49d60fafe2f7c0ffb02eaf1f51` (`user_id`),
  CONSTRAINT `FK_49d60fafe2f7c0ffb02eaf1f51c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_dc6b6e14d15e43eaed401afa05a` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_participant`
--

LOCK TABLES `booking_participant` WRITE;
/*!40000 ALTER TABLE `booking_participant` DISABLE KEYS */;
INSERT INTO `booking_participant` VALUES ('61029d15-f234-4ac0-a5f8-cd70be659eda','22ecc9f5-390a-4b2e-b43e-c559056b6c63'),('7c4b8317-fc82-43f4-9af3-a7192c5cf3e5','658af3fa-89c4-49e4-ab9d-bae2832aeebd'),('d3296635-edcf-40c4-9c52-84bd467345aa','714e78b1-9c75-4c15-b93e-2c28d3fec56b');
/*!40000 ALTER TABLE `booking_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration`
--

DROP TABLE IF EXISTS `configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration` (
  `id` varchar(36) NOT NULL,
  `config_name` varchar(255) NOT NULL,
  `config_value` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration`
--

LOCK TABLES `configuration` WRITE;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` varchar(36) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `day_rent` int NOT NULL,
  `status` enum('paid','unpaid','cancelled') NOT NULL DEFAULT 'unpaid',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `booking_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_ee283c9adbadc5f1a2ff392eee` (`booking_id`),
  CONSTRAINT `FK_ee283c9adbadc5f1a2ff392eee5` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES ('665c732d-0647-409a-b819-806cc0bf8074',150000.00,450000.00,3,'paid','2025-06-22 15:11:45.000000','2025-06-22 15:11:47.000000',NULL,'7c4b8317-fc82-43f4-9af3-a7192c5cf3e5'),('70d89cea-7e09-4c90-b6ca-a1bf58f8e853',150000.00,1875000.00,5,'paid','2025-06-22 15:11:53.000000','2025-06-22 15:11:56.000000',NULL,'d3296635-edcf-40c4-9c52-84bd467345aa'),('ff9bf372-dbf7-4698-9510-9fc0db8c4f4e',210000.00,1680000.00,8,'paid','2025-06-22 22:57:09.000000','2025-06-22 22:57:12.000000',NULL,'61029d15-f234-4ac0-a5f8-cd70be659eda');
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_revenue`
--

DROP TABLE IF EXISTS `monthly_revenue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_revenue` (
  `month` varchar(255) NOT NULL,
  `total_revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_revenue`
--

LOCK TABLES `monthly_revenue` WRITE;
/*!40000 ALTER TABLE `monthly_revenue` DISABLE KEYS */;
INSERT INTO `monthly_revenue` VALUES ('2025-06',4005000.00,'2025-06-22 08:12:39.128592');
/*!40000 ALTER TABLE `monthly_revenue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_revenue_detail`
--

DROP TABLE IF EXISTS `monthly_revenue_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_revenue_detail` (
  `month` varchar(255) NOT NULL,
  `room_type_id` varchar(255) NOT NULL,
  `revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`month`,`room_type_id`),
  KEY `FK_5e6a2639ee48d03ad8b4f8edb47` (`room_type_id`),
  CONSTRAINT `FK_49a86fcb81b25f5b968df782014` FOREIGN KEY (`month`) REFERENCES `monthly_revenue` (`month`) ON DELETE CASCADE,
  CONSTRAINT `FK_5e6a2639ee48d03ad8b4f8edb47` FOREIGN KEY (`room_type_id`) REFERENCES `room_type` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_revenue_detail`
--

LOCK TABLES `monthly_revenue_detail` WRITE;
/*!40000 ALTER TABLE `monthly_revenue_detail` DISABLE KEYS */;
INSERT INTO `monthly_revenue_detail` VALUES ('2025-06','1d9aeaf4-78b3-471f-9aca-61ad767464d8',1680000.00),('2025-06','9f24892e-8b5e-4d8a-8390-be7bb855dcdd',2325000.00);
/*!40000 ALTER TABLE `monthly_revenue_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `params`
--

DROP TABLE IF EXISTS `params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `params` (
  `id` varchar(36) NOT NULL,
  `param_name` varchar(255) NOT NULL,
  `param_value` float NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `params`
--

LOCK TABLES `params` WRITE;
/*!40000 ALTER TABLE `params` DISABLE KEYS */;
INSERT INTO `params` VALUES ('016f4b7c-71f9-4bfb-b7b1-937c30525737','surcharge_rate',0.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-07 03:40:47.000000','2025-06-11 13:22:22.000000'),('07335a05-c508-42f6-8e38-509aec244685','max_guests_per_room',3,'Maximum number of guests allowed per room','2025-06-06 13:40:47.000000','2025-06-11 13:21:32.000000'),('086ab19a-5291-421c-87e4-0de277b2a4af','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-12 14:46:47.000000'),('09c2ffca-5b03-474a-a6dd-cad92d45beec','surcharge_rate',0.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-07 10:40:47.000000','2025-06-12 13:10:53.000000'),('168e34b2-1a38-4438-bb00-a4200232737e','max_guests_per_room',5,'Maximum number of guests allowed per room','2025-06-08 14:40:47.000000','2025-06-21 13:55:12.000000'),('17e184b5-5193-4d4d-bef1-156e4e26e595','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-15 05:55:12.000000'),('180ac564-6931-4ed6-aaf9-2b24ac7ab161','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-12 14:48:04.000000'),('1e6bcde8-1224-4ac9-b688-155464a4901d','surcharge_rate',0.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-06 13:40:47.000000','2025-06-11 13:21:32.000000'),('2164ae60-7d4f-46a3-b50d-7511ddb78dc2','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-12 14:46:47.000000'),('2361aa2d-a33b-41b0-8b66-9a8f85d14781','surcharge_rate',0.5,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-22 06:42:55.347208',NULL),('2a9cfe92-0a0c-4ed3-8ff0-f4c5d53f347d','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-13 01:12:49.000000'),('2c3dd3da-b8b7-4895-9e94-ec74542753fb','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-20 14:13:37.000000'),('3fc1a68a-da59-4613-9bf7-55342de20a16','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-07 17:40:47.000000','2025-06-12 13:11:05.000000'),('41fa03e8-8052-4be2-b3f2-d53a9d0fdbbf','max_guests_per_room',3,'Maximum number of guests allowed per room','2025-06-06 06:40:47.903826','2025-06-11 13:18:24.000000'),('537959c1-5f94-4409-91b3-85d56f3a2e69','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-07 17:40:47.000000','2025-06-12 13:11:05.000000'),('59942069-44c6-4836-be76-fa5e52a43dcb','foreign_guest_factor',2.5,'Factor for calculating price for foreign guests','2025-06-21 13:55:12.952064','2025-06-22 06:42:54.000000'),('5cb71015-4844-4b89-9ef5-755c40b33a4c','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-13 01:12:09.000000'),('5cfcad1b-5d12-4330-830c-1524d7f4b7ae','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-13 01:12:09.000000'),('5e1c1378-bbb3-43d2-a84b-7b115658939b','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-06 13:40:47.000000','2025-06-11 13:21:32.000000'),('5ed55370-b797-48ac-be89-89e639a80e77','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-12 14:46:38.000000'),('6243dd23-3848-4b21-b214-64e79c80bc18','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-13 01:12:05.000000'),('68745012-1a4a-4f20-a899-548afae63d4d','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-07 10:40:47.000000','2025-06-12 13:10:53.000000'),('6aaafea7-b149-4ca7-9fa4-074380683eb8','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-13 01:12:43.000000'),('6c6b0443-1f2b-43bc-86a4-4dc64fcff3f1','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-12 14:44:12.000000'),('6f480ff6-4ed8-4b5f-ad67-5250946912aa','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-12 14:48:04.000000'),('7019d3d2-8dcf-4fda-9650-1216dca7e71f','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-13 01:12:43.000000'),('7b795e0e-952b-4f79-a9b5-b98796261830','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-15 05:55:12.000000'),('7e649013-2fb0-4c68-8393-1d07b6347f12','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-12 14:44:12.000000'),('8077840b-d92c-4fb8-9171-7bd71eb7cbbd','max_guests_per_room',5.5,'Maximum number of guests allowed per room','2025-06-08 00:40:47.000000','2025-06-12 13:11:20.000000'),('81bac1dc-7ff7-4a32-8faf-09293ed6ee04','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-15 05:55:12.000000'),('8226078b-1f99-499b-a053-c79ce764ac1d','foreign_guest_factor',2.5,'Factor for calculating price for foreign guests','2025-06-22 06:42:55.332890',NULL),('83eddf0a-1cc2-4291-a148-5e33307b0142','max_guests_per_room',5,'Maximum number of guests allowed per room','2025-06-22 06:42:55.355262',NULL),('858bcd15-1ad9-4a38-9f7e-ff82ba5b807e','max_guests_per_room',5.5,'Maximum number of guests allowed per room','2025-06-07 03:40:47.000000','2025-06-11 13:22:22.000000'),('8644c092-bdbd-4d7e-b708-91785f8c987c','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 00:40:47.000000','2025-06-12 13:11:20.000000'),('8cfaff3d-2d8d-4721-af14-a919951086e1','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-12 14:46:38.000000'),('8fca7dcb-ec5c-4117-b345-e976dc945c06','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-07 10:40:47.000000','2025-06-12 13:10:52.000000'),('90df4fb2-f672-4a88-a6b6-3fc8ace5e0d8','surcharge_rate',0.25,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-06 06:40:47.984179','2025-06-11 13:18:24.000000'),('92bb9f54-d9d9-485f-914b-441c838496c5','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-13 01:12:49.000000'),('968a03eb-bd94-433b-afde-758ded975d9d','foreign_guest_factor',2.5,'Factor for calculating price for foreign guests','2025-06-08 14:40:47.000000','2025-06-21 13:55:12.000000'),('98becd66-b712-439f-9c29-d1a970edb546','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 00:40:47.000000','2025-06-12 13:11:20.000000'),('9b073b26-8dcc-4b6c-8656-6650794e0830','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-13 01:12:05.000000'),('9e0c9c8c-e1a5-4521-b4df-1dd2e01e546d','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-07 03:40:47.000000','2025-06-11 13:22:22.000000'),('a02b18a2-606e-4b9e-8bb7-8ac6723a044f','surcharge_rate',0.25,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-20 14:13:37.000000'),('a0351f9f-f95b-4259-adc0-5c584666d01f','surcharge_rate',2.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 07:40:47.000000','2025-06-13 01:12:09.000000'),('a90a5778-bc87-4748-84ee-3a2ea8d71bc0','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-06 20:40:47.000000','2025-06-11 13:21:45.000000'),('aadbd94f-752f-421d-9561-87b7a7b0d9a7','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-20 14:13:37.000000'),('abdbe29e-e1af-4671-8268-701fb56529a2','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-06 20:40:47.000000','2025-06-11 13:21:45.000000'),('b61d2d85-61c5-4f85-ab3c-6339b1865569','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-12 14:46:38.000000'),('c56f9268-db74-4d07-adb8-60b247e7d443','surcharge_rate',0.27,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-06 20:40:47.000000','2025-06-11 13:21:45.000000'),('ca6b7a1d-d5cb-4f21-a385-828adc10e57b','surcharge_rate',0.5,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-21 13:55:13.206688','2025-06-22 06:42:54.000000'),('ccbc6c40-734b-42c5-af1f-4df9aeba1660','foreign_guest_factor',2.5,'Factor for calculating price for foreign guests','2025-06-08 14:40:47.000000','2025-06-21 13:47:42.000000'),('cf0045ba-663d-440c-900e-bd173e44df3b','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-13 01:12:43.000000'),('d059005d-dfc3-4143-b02e-5de7f14c16f6','surcharge_rate',0.5,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 14:40:47.000000','2025-06-21 13:47:42.000000'),('d1a87063-725a-4f0b-9242-48f50e59ee7f','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-13 01:12:49.000000'),('d39ab503-abd0-4611-b91d-04aa3aa65ac7','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-06 06:40:47.944791','2025-06-11 13:18:24.000000'),('dba3fc80-ec65-4972-a5ce-729d6e6bc648','surcharge_rate',0.5,'Surcharge rate for bookings when the number of guests exceeds the limit','2025-06-08 14:40:47.000000','2025-06-21 13:55:13.000000'),('e0a640db-35e8-4006-a91f-ff389cfce723','max_guests_per_room',4,'Maximum number of guests allowed per room','2025-06-21 13:55:12.967582','2025-06-22 06:42:54.000000'),('e9fb010c-627a-4390-ae82-6b51d52bceee','foreign_guest_factor',1.5,'Factor for calculating price for foreign guests','2025-06-08 07:40:47.000000','2025-06-13 01:12:05.000000'),('f4263819-24f3-4e9e-8f7e-1f955066bcbb','max_guests_per_room',4,'Maximum number of guests allowed per room','2025-06-08 14:40:47.000000','2025-06-21 13:47:42.000000'),('f8f166ea-864f-4d4f-a222-9553a3e323d6','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-08 07:40:47.000000','2025-06-12 14:48:04.000000'),('fdd85782-1131-4448-b6da-a8d5b8aacdd2','max_guests_per_room',6,'Maximum number of guests allowed per room','2025-06-07 17:40:47.000000','2025-06-12 13:11:05.000000');
/*!40000 ALTER TABLE `params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` varchar(36) NOT NULL,
  `payment_method` enum('card','cash') NOT NULL DEFAULT 'card',
  `amount` decimal(10,2) NOT NULL,
  `payment_status` enum('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `payment_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `invoice_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_20cc84d8a2274ae86f551360c1` (`invoice_id`),
  CONSTRAINT `FK_20cc84d8a2274ae86f551360c11` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('02bfe74f-7aea-4c23-a5a3-e765ec78f546','card',1875000.00,'paid','2025-06-22 15:12:48.000000','70d89cea-7e09-4c90-b6ca-a1bf58f8e853'),('41fcaef5-bd5d-40ac-88b3-ab15caf74051','card',1680000.00,'paid','2025-06-22 16:09:00.000000','ff9bf372-dbf7-4698-9510-9fc0db8c4f4e'),('df47c030-275e-46e2-b5c2-552b901d399e','card',450000.00,'paid','2025-06-22 15:12:08.000000','665c732d-0647-409a-b819-806cc0bf8074');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `id` varchar(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `dob` timestamp NULL DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `identity_number` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_d752442f45f258a8bdefeebb2f` (`user_id`),
  CONSTRAINT `FK_d752442f45f258a8bdefeebb2f2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES ('0bb9689d-3689-43c9-b436-26c1d7dbb667','moda','vn','active','1990-01-15 07:00:00','0555555555','82, street 2','123456789','2025-06-08 16:31:23.000000','2025-06-08 16:31:23.000000',NULL,'543b3ebc-d485-4061-84ed-bc10a3e49dc4'),('1035fc56-007f-47fa-932c-e09384317bfb','John Jack','England','inactive','1999-08-20 00:00:00','0393876892','15 Rue de Rivoli, Paris, France','05420522153','2025-06-21 17:19:30.000000','2025-06-21 17:24:09.000000','2025-06-21 17:24:09.000000','b5414f15-87b7-4162-9685-cc530121eec2'),('4d5c1e11-5703-4991-8a8a-b61f120b86a7','John Doe','Viet Nam','active','1990-01-01 07:00:00','1234567890','123 Main St, Hanoi','1234567890','2025-06-10 12:11:30.000000','2025-06-21 17:12:02.000000',NULL,'973f89d9-19f8-4fe5-85a7-b70ff3662e73'),('6c40abc9-2563-4042-9cf8-a74f18148da5','Book new',NULL,'active',NULL,NULL,'Viet Nam','432432342432','2025-06-22 09:02:10.126005','2025-06-22 09:02:10.126005',NULL,'22ecc9f5-390a-4b2e-b43e-c559056b6c63'),('73eed4ad-182e-4573-b482-e06760fc5070','minh','VietNam','inactive','2000-10-10 07:00:00','0367388105','Bình Dương','095205005141','2025-06-17 21:52:25.000000','2025-06-22 06:41:51.000000','2025-06-22 06:41:50.000000','c0ae2c74-47c9-4861-a0a7-5feee5dd956d'),('9eb8772e-0448-46da-acc3-fd264b393202','John Doe','Viet Nam','active','2004-12-12 00:00:00','0987654321','Thu Duc','2352123543','2025-06-22 22:10:24.000000','2025-06-22 22:10:24.000000',NULL,'658af3fa-89c4-49e4-ab9d-bae2832aeebd'),('a920b70f-5608-4fae-a7c5-b8457020a7d0','Booker',NULL,'active',NULL,NULL,'Viet Nam','6543453453','2025-06-22 08:57:08.842154','2025-06-22 08:57:08.842154',NULL,'eda9328a-76d5-497e-bd34-2e5c43b49d11'),('b12371c7-f014-4101-b60a-3c28bcef70fa','Emily Hartman - edited','Canada','active','1990-12-15 00:00:00','0987654321','456 Maple Avenue, Toronto, Canada','CA987654321','2025-06-06 06:40:47.782221','2025-06-20 14:20:28.000000',NULL,'e67eb3c0-2f6c-47d9-a37d-be1d8c56d10b'),('bc19a3a1-ac76-4eea-8b56-81e7846c5481','John Doe','England','active','2001-10-09 00:00:00','0123456788','123 Main Street, London, Edit','23520461233','2025-06-06 06:40:47.743189','2025-06-22 06:43:30.000000',NULL,'e622f887-fbed-4462-ac7f-c4e9c5dbd738'),('bc6488cf-3a3b-478d-bba5-800f731833eb','USER Edited','Viet Nam','active','2005-02-05 07:00:00','243574435','Thu Duc Edited','11131343242','2025-06-14 10:18:47.000000','2025-06-21 17:09:48.000000',NULL,'5bb184ab-d3e8-42a0-98dc-31d403f1d5d2'),('c78df4d7-2890-4779-85eb-316b12f8a5eb','Luke Coleman','England','active','2004-08-20 00:00:00','0393873632','Ho Chi Minh City, Viet Nam','054205004321','2025-06-21 16:38:12.000000','2025-06-21 16:38:12.000000',NULL,'6bc984b9-6f6d-4ed0-83db-905135cce043'),('d7baa392-acb5-41a1-83b7-0e3819103f5f','moda','vn','active','1990-01-15 07:00:00','0555555555','82, street 2','123456789','2025-06-08 17:37:34.000000','2025-06-19 14:15:41.000000',NULL,'664bd776-4748-4ed5-9e71-d11fc7c336c8'),('da15816a-f8e8-4203-b80a-9742a177f998','William Robinson','England','active','2005-08-20 00:00:00','0393878321','1600 Pennsylvania Avenue NW, Washington, D.C., USA','054205005789','2025-06-21 16:48:05.000000','2025-06-21 16:48:05.000000',NULL,'72573688-dd33-4b6f-ab81-1718c6b83a46'),('e4c68cd9-04b3-4634-85e3-51df23f95fb9','moda','France','active','2005-10-10 00:00:00','0555555555','82, street 2','123456789','2025-06-08 17:38:00.000000','2025-06-12 12:57:45.000000',NULL,'4902a069-a5bb-41ea-b49f-6261411914b0'),('ffc801ca-d39e-4b6a-b033-6066b379c22a','Booker',NULL,'active',NULL,NULL,'Thu Duc','45332348987','2025-06-22 08:11:52.507978','2025-06-22 08:11:52.507978',NULL,'714e78b1-9c75-4c15-b93e-2c28d3fec56b');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` varchar(36) NOT NULL,
  `role_name` enum('admin','user','superadmin') NOT NULL DEFAULT 'user',
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4810bc474fe6394c6f58cb7c9e` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('06402899-478b-40d8-bdf5-76095bf2f3e7','admin','Responsible for managing users, overseeing content, and handling operational settings within the system.','2025-06-06 06:40:46.944202','2025-06-06 06:40:46.944202',NULL),('874da6b0-dcdc-42e7-9a69-b7a24a2cdd84','superadmin','Has full control over the system, including managing admins, critical configurations, and high-level operations.','2025-06-06 06:40:46.894116','2025-06-06 06:40:46.894116',NULL),('bb9e9c57-9869-475f-8c13-3a112d0a5870','user','Standard role with access to general system features and personal data management.','2025-06-06 06:40:46.984283','2025-06-06 06:40:46.984283',NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` varchar(36) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `note` text,
  `status` enum('available','occupied') NOT NULL DEFAULT 'available',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `room_type_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_224248134ed3ac1fb6d2f87290` (`room_number`),
  KEY `FK_55b383d0ec20230d193ca584a4a` (`room_type_id`),
  CONSTRAINT `FK_55b383d0ec20230d193ca584a4a` FOREIGN KEY (`room_type_id`) REFERENCES `room_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES ('0046d896-6f1d-4f1f-aacc-bbc1bbe20bb6','B-418','Type B room, quiet area on 4 floor','available','2025-06-11 05:40:49.000000','2025-06-22 09:05:53.000000',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('05bd855d-4618-4582-939c-323024088fa2','A-501','Type A room, near window on 5 floor and sea view - edited','available','2025-06-08 14:40:50.000000','2025-06-22 23:11:51.000000',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('0ba6c5ec-1c78-4dad-8a41-03451601547e','B-919','Type B room, quiet area on 9 floor','available','2025-06-06 13:40:49.000000','2025-06-21 18:38:49.000000',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('0ea7cf92-130f-4231-90c4-6a82a9e606e4','C-210','Type C room, quiet area on 2 floor','available','2025-06-06 06:40:49.000000','2025-06-21 17:23:24.000000','2025-06-21 17:23:24.000000','1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('15947e01-e444-4c6b-94e8-8bb0bc497b4e','C-702','Type C room, quiet area on 7 floor','available','2025-06-06 13:40:49.000000','2025-06-21 02:32:40.111826',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('15adfc69-22e5-48f6-9332-5d216006c1e6','B-710','Type B room, near stairs on 7 floor','available','2025-06-07 10:40:49.000000','2025-06-22 07:43:01.000000',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('16d84f83-7111-47fd-acc7-f99d4cddefec','C-516','Type C room, near window on 5 floor','available','2025-06-06 13:40:49.000000','2025-06-21 18:06:51.000000',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('18134128-d66d-47a0-8853-a9dd9b6b6cf7','B-114','Type B room, near window on 1 floor and sea view','available','2025-06-06 13:40:49.000000','2025-06-21 12:34:26.477658',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('1b5bed9d-f347-434b-a042-eda940d6ccfe','A-313','Type A room, quiet area on 3 floor','available','2025-06-06 06:40:49.000000','2025-06-21 12:34:30.041935',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('2184d498-1e68-4fc8-a718-910d6ee3ae76','B-902','Type B room, near stairs on 9 floor','available','2025-06-06 06:40:50.000000','2025-06-21 18:45:00.000000',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('25356b24-7191-4079-8bd8-3a4d23d0a292','B-809','Type B room, near elevator on 8 floor','available','2025-06-06 06:40:49.000000','2025-06-21 18:36:33.000000',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('2afa75df-06ad-44de-8f32-ed88299c83e2','A-1017','Type A room, near window on 10 floor','available','2025-06-06 13:40:50.000000','2025-06-21 02:32:57.971529',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('2e3be192-8287-4b7c-87dd-469869a0c969','B-920','Type B room, close to restaurant on 9 floor','available','2025-06-06 06:40:49.414603','2025-06-06 06:40:49.414603',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('3390002b-c4c6-40aa-adff-c647877c3e12','B-915','Type B room, near window on 9 floor','available','2025-06-06 06:40:48.000000','2025-06-21 12:34:38.685135',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('34ed28f7-d11c-4117-911d-efa0ae7c9542','A-717','Type A room, near elevator on 7 floor','available','2025-06-06 06:40:49.610076','2025-06-06 06:40:49.610076',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('395dcf65-2328-409b-afa0-9e5258de0f0a','B-810','Type B room, close to restaurant on 8 floor','available','2025-06-06 06:40:50.000000','2025-06-21 12:34:36.699119',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('474c53ec-a3b6-468a-ba1e-a9b10abbfd51','C-510','Type C room, near stairs on 5 floor','available','2025-06-06 06:40:49.099591','2025-06-06 06:40:49.099591',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('4a30ea4e-0e3d-4ac3-9248-4a2055531b88','C-402','Type C room, quiet area on 4 floor','available','2025-06-06 06:40:49.000000','2025-06-20 14:15:12.051120',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('4a6fd848-34dd-4182-8795-eedb553f591f','A-602','Type A room, near elevator on 6 floor','available','2025-06-06 06:40:50.000000','2025-06-21 12:34:46.712011',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('4a8c75a5-cc15-4db0-b81d-60f92b271b0a','A-1019','Type A room, close to restaurant on 10 floor','occupied','2025-06-06 13:40:49.000000','2025-06-06 13:40:49.000000',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('6416391a-cc3b-4f8e-8040-535bc965b0de','A-105','Type A room, close to restaurant on 1 floor','occupied','2025-06-06 13:40:49.000000','2025-06-06 13:40:49.000000',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('7809eafe-cbb6-4aaf-8b7f-714ea435b797','C-220','Type C room, quiet area on 2 floor','available','2025-06-06 06:40:49.885810','2025-06-06 06:40:49.885810',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('7a5deed2-2765-481e-a2a8-0cee65302c48','B-217','Type B room, quiet area on 2 floor','available','2025-06-06 06:40:48.628052','2025-06-06 06:40:48.628052',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('820b7835-8a53-4b6d-8eda-937c2df927a5','A-201','Type A room, close to restaurant on 2 floor','available','2025-06-06 13:40:48.000000','2025-06-21 02:32:45.503884',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('86fc79ee-86a4-45e7-a8ad-4be330b8d27e','B-811','Type B room, close to restaurant on 8 floor','available','2025-06-06 06:40:49.000000','2025-06-21 12:34:52.933677',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('8d4eb9cd-1895-4bae-a932-ddc4fc7a744f','A-504','Type A room, close to restaurant on 5 floor','available','2025-06-06 06:40:48.982557','2025-06-06 06:40:50.459029',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('953e8f84-6f9a-4810-9b9d-ff5b25a07a31','B-316','Type B room, quiet area on 3 floor','available','2025-06-06 06:40:50.615001','2025-06-06 06:40:50.615001',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('95ab6dc7-051c-4867-945b-c80297e7b747','B-416','Type B room, quiet area on 4 floor','available','2025-06-12 12:41:27.000000','2025-06-21 12:34:55.516455',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('9622baf3-38d5-409b-9722-c1742a15bf33','A-207','Type A room, near elevator on 2 floor','available','2025-06-06 06:40:48.943674','2025-06-06 06:40:48.943674',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('9e0caad6-1a0c-47d9-8a81-7206e38478dc','A-906','Type A room, near window on 9 floor','available','2025-06-06 06:40:49.140229','2025-06-06 06:40:49.140229',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('a4ed6b49-05a1-4eea-bcf9-448b9d1c21a6','A-919','Type A room, near stairs on 9 floor','available','2025-06-06 06:40:50.022341','2025-06-06 06:40:50.022341',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('a4ee92dd-937d-4f5f-82a1-f914021b2ee6','C-813','Type C room, near stairs on 8 floor','available','2025-06-06 06:40:48.822976','2025-06-06 06:40:49.453598',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('af0700f8-446f-44b7-8617-3dca48ba285d','B-1008','Type B room, close to restaurant on 10 floor','available','2025-06-06 06:40:50.731758','2025-06-06 06:40:50.731758',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('af1668fd-30a9-4283-aadd-cc709dcce38e','C-620','Type C room, near window on 6 floor','available','2025-06-06 06:40:49.492722','2025-06-06 06:40:49.492722',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('b64983c6-49e7-4f1d-a4f3-66a7981f3856','B-107','Type B room, close to restaurant on 1 floor','available','2025-06-06 06:40:48.000000','2025-06-21 12:35:04.444922',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('baa59ab8-6db6-439e-9391-df0c4e0b88b4','C-601','Type C room, near elevator on 6 floor','available','2025-06-06 06:40:48.745185','2025-06-06 06:40:48.745185',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('bb3e9222-e0aa-4f04-8355-c56bb29f9daf','C-701','Type C room, near window on 7 floor','available','2025-06-06 06:40:48.862051','2025-06-06 06:40:48.862051',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('bf25de22-24f7-4370-b82e-877b6776d65b','C-2004','Type C room, near window on 5 floor','available','2025-06-22 06:39:35.606815','2025-06-22 06:39:35.606815',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('c9e38ab8-77c6-44ed-9259-c90e312391f8','C-1210','Type C room, quiet area on 4 floor','available','2025-06-11 13:01:25.027525','2025-06-11 13:01:25.027525',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('caab91e6-35fc-4790-9bb0-53ecf45c31ff','A-713','Type A room, close to restaurant on 7 floor','available','2025-06-06 06:40:49.258190','2025-06-06 06:40:49.258190',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('cfe90c1f-1b84-42a5-a5a6-39cba1f37ef5','B-914','Type B room, near stairs on 9 floor','available','2025-06-06 06:40:49.000000','2025-06-21 12:35:04.508369',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('d38dc0f1-bd38-4a81-9eb4-aa9e995a8b76','C-2003','Type C room, near window on 6 floor - edited','available','2025-06-15 16:24:49.212251','2025-06-15 16:31:28.000000',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('d7307910-2497-4c9a-9b59-e2cfb83afef8','B-2003','Type B room, quiet area on 4 floor','available','2025-06-21 13:52:11.679655','2025-06-21 13:52:11.679655',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('e0236290-757c-4899-befe-80b695728f92','B-112','Type B room, close to restaurant on 1 floor','available','2025-06-06 06:40:48.542723','2025-06-06 06:40:48.542723',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('e8c0e95b-43ab-46ab-bb33-e71182b364c0','B-510','Type B room, near elevator on 5 floor','available','2025-06-06 06:40:49.336241','2025-06-06 06:40:49.336241',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('ee5134ff-0af3-4677-9f95-a5a498379b40','A-210','Type A room, near stairs on 2 floor','available','2025-06-06 06:40:49.179214','2025-06-06 06:40:49.179214',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('f8494abc-4388-4e7c-a228-d4ad51033214','C-1007','Type C room, near elevator on 10 floor','available','2025-06-06 06:40:48.589196','2025-06-06 06:40:48.589196',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8'),('fc56055c-0e10-419d-860a-05457efb5f74','A-220','Type A room, near stairs on 5 floor','available','2025-06-06 06:40:50.342257','2025-06-19 15:20:41.000000',NULL,'9f24892e-8b5e-4d8a-8390-be7bb855dcdd'),('fdb071af-59e1-4d03-b1c7-6ae0dc08e0f2','B-402','Type B room, quiet area on 4 floor','available','2025-06-06 06:40:49.727293','2025-06-06 06:40:49.727293',NULL,'6a486cda-7364-4aed-a9ec-badc42df490a'),('ff2671f8-3860-44e5-9982-e7e0e90a873d','C-801','Type C room, close to restaurant on 8 floor','available','2025-06-06 06:40:50.653731','2025-06-06 06:40:50.653731',NULL,'1d9aeaf4-78b3-471f-9aca-61ad767464d8');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_type`
--

DROP TABLE IF EXISTS `room_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_type` (
  `id` varchar(36) NOT NULL,
  `name` enum('A','B','C') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `room_price` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0e04f7180c0010be1afdb24860` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_type`
--

LOCK TABLES `room_type` WRITE;
/*!40000 ALTER TABLE `room_type` DISABLE KEYS */;
INSERT INTO `room_type` VALUES ('1d9aeaf4-78b3-471f-9aca-61ad767464d8','C','Luxury room featuring a private balcony and premium furnishings.',210000.00,'2025-06-06 06:40:48.221835','2025-06-15 16:46:12.000000',NULL),('6a486cda-7364-4aed-a9ec-badc42df490a','B','Spacious suite with modern amenities and a comfortable lounge area.',200000.00,'2025-06-06 06:40:48.182900','2025-06-22 08:58:38.000000',NULL),('9f24892e-8b5e-4d8a-8390-be7bb855dcdd','A','Deluxe room with a beautiful city view.',150000.00,'2025-06-06 06:40:48.142206','2025-06-22 06:42:13.000000',NULL);
/*!40000 ALTER TABLE `room_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `role_id` varchar(36) DEFAULT NULL,
  `user_type_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_fb2e442d14add3cefbdf33c4561` (`role_id`),
  KEY `FK_ec4e80af79f6f17170f6c30b7a9` (`user_type_id`),
  CONSTRAINT `FK_ec4e80af79f6f17170f6c30b7a9` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_fb2e442d14add3cefbdf33c4561` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('22ecc9f5-390a-4b2e-b43e-c559056b6c63','booknew@gmail.com',NULL,'2025-06-22 09:02:09.729613','2025-06-22 09:02:09.729613',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('4902a069-a5bb-41ea-b49f-6261411914b0','levanbao12123@gmail.com','$2b$10$4.3HUnA9cQLFwes2MRr.E.0/I15kLAB3.PLZTL/hTDyBzeX45eY8q','2025-06-09 00:38:00.000000','2025-06-09 00:38:00.000000',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('543b3ebc-d485-4061-84ed-bc10a3e49dc4','levanbao21052@gmail.com','$2b$10$BPMjU7tdNxjWUA/lqiO3k.8ExORmcSjbmtY.xTUge4htpJGsdShpm','2025-06-08 16:31:23.647194','2025-06-08 16:31:23.647194',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('5bb184ab-d3e8-42a0-98dc-31d403f1d5d2','user@gmail.com','$2b$10$vdOyXn3Eb35onjUdWxzE7uLqt/ZCNctUFzJ20d/w1zD1FvHNLYHAe','2025-06-15 00:18:49.000000','2025-06-21 17:09:48.000000',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('658af3fa-89c4-49e4-ab9d-bae2832aeebd','johndoe122@gmail.com','$2b$10$/sVBeFSzi.yAtjQjGzo1O.RvkGjidv4.PgaqbSXRZdAsjhAlVSswy','2025-06-22 08:10:25.391068','2025-06-22 08:10:25.391068',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('664bd776-4748-4ed5-9e71-d11fc7c336c8','levanbao12@gmail.com','$2b$10$d36dv/IVmv3S9kyCq9oNiO4DTXLnadUvytjsMKNt7q9/PttzR.74q','2025-06-08 17:37:35.000000','2025-06-19 14:15:41.000000',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('6bc984b9-6f6d-4ed0-83db-905135cce043','truongduchuy24105@gmail.com','$2b$10$uHqPxqt/73/U8zTCvyOg0OGdzJ1Rz.a1A1drxjW1PqpcaMJoPO7V6','2025-06-21 02:38:13.934604','2025-06-21 02:38:13.934604',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('714e78b1-9c75-4c15-b93e-2c28d3fec56b','booker56@gmail.com',NULL,'2025-06-22 08:11:52.090450','2025-06-22 08:11:52.090450',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','b1b554aa-9828-4ec3-a692-9a22c0566bc6'),('72573688-dd33-4b6f-ab81-1718c6b83a46','nestjs2005@gmail.com','$2b$10$bVG4iCvJNpRMWx5Xk23JkOj7qX4siRx.bzqguYzT89UW9ZaiuXQ1e','2025-06-21 02:48:06.995295','2025-06-21 02:48:06.995295',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','b1b554aa-9828-4ec3-a692-9a22c0566bc6'),('973f89d9-19f8-4fe5-85a7-b70ff3662e73','lengocanhpyne363@gmail.com','$2b$10$4Jf.xmTv9cBSUyhjMBPb/.FfubJWYyoShTSeD5SlL6BokzBGhAriq','2025-06-10 12:11:32.379201','2025-06-21 17:12:01.000000',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('b5414f15-87b7-4162-9685-cc530121eec2','johndoe02@gmail.com','$2b$10$sKMF/k6SZ3vzLZc409Px9.T.2OJtQ3EiM14u1.ZUPTf11YFINXgBG','2025-06-21 03:19:31.939969','2025-06-21 17:24:09.000000','2025-06-21 17:24:09.000000','bb9e9c57-9869-475f-8c13-3a112d0a5870','04c2a90c-b245-495c-a643-02e7cdc29620'),('c0ae2c74-47c9-4861-a0a7-5feee5dd956d','huynhhiep210305@gmail.com','$2b$10$YjLfoEzTRCCtZwtFAm7cO.4Vhi/rthVRuEwfhJ1UD2G1XDOgu7E16','2025-06-17 07:52:26.857820','2025-06-22 06:41:50.000000','2025-06-22 06:41:50.000000','bb9e9c57-9869-475f-8c13-3a112d0a5870','b1b554aa-9828-4ec3-a692-9a22c0566bc6'),('e622f887-fbed-4462-ac7f-c4e9c5dbd738','admin123@gmail.com','$2b$10$rOxyp8DQW.TlWTk3W.wuxOCuJF7LcfkbKxgfqIrTmxaaKL8qTLVVC','2025-06-06 06:40:47.484801','2025-06-22 06:43:29.000000',NULL,'06402899-478b-40d8-bdf5-76095bf2f3e7','04c2a90c-b245-495c-a643-02e7cdc29620'),('e67eb3c0-2f6c-47d9-a37d-be1d8c56d10b','superadmin123@gmail.com','$2b$10$WMxitFS.1ColSgC88Z70Me.489uxPKz6V5gLSINwkuVHV0IE1E5nm','2025-06-06 06:40:47.535841','2025-06-20 14:20:28.000000',NULL,'874da6b0-dcdc-42e7-9a69-b7a24a2cdd84','04c2a90c-b245-495c-a643-02e7cdc29620'),('eda9328a-76d5-497e-bd34-2e5c43b49d11','book1234@gmail.com',NULL,'2025-06-22 08:57:08.415739','2025-06-22 08:57:08.415739',NULL,'bb9e9c57-9869-475f-8c13-3a112d0a5870','b1b554aa-9828-4ec3-a692-9a22c0566bc6');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `id` varchar(36) NOT NULL,
  `type_name` enum('foreign','local') NOT NULL DEFAULT 'local',
  `description` varchar(255) DEFAULT NULL,
  `surcharge_factor` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7a829a223af4a97d4ab6762bd0` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES ('04c2a90c-b245-495c-a643-02e7cdc29620','local','Represents a local customer or guest, typically from within the country.',1.00,'2025-06-06 06:40:47.184217','2025-06-06 06:40:47.184217',NULL),('b1b554aa-9828-4ec3-a692-9a22c0566bc6','foreign','Represents a foreign customer or guest, typically from outside the country.',1.50,'2025-06-06 06:40:47.144024','2025-06-06 06:40:47.144024',NULL);
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'defaultdb'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-30 23:12:51
