CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `auth0UserId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `initalInvestment` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_auth0UserId_key` (`auth0UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
