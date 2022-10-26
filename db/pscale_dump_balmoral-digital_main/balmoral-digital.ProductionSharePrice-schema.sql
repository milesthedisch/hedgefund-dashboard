CREATE TABLE `ProductionSharePrice` (
  `datetime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `price` decimal(9,6) NOT NULL DEFAULT '0.000000',
  UNIQUE KEY `ProductionSharePrice_datetime_key` (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
