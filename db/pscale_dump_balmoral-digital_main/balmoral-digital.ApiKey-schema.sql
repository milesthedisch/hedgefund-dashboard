CREATE TABLE `ApiKey` (
  `apiKeyID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `ApiKey_apiKeyID_key` (`apiKeyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
