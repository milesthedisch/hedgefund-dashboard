CREATE TABLE `UserTransactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('REDEMPTION','PURCHASE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PURCHASE',
  `units` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unitPrice` decimal(9,6) NOT NULL,
  `audInvestment` decimal(15,2) NOT NULL,
  `datetime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `fee` decimal(9,6) NOT NULL DEFAULT '0.010000',
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserTransactions_userId_idx` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
