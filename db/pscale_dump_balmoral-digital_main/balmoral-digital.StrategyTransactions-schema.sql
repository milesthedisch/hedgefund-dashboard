CREATE TABLE `StrategyTransactions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datetime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `balance` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `strategyId` int NOT NULL,
  UNIQUE KEY `StrategyTransactions_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
