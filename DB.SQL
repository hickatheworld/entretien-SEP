CREATE DATABASE IF NOT EXISTS `HOTEL`;
USE `HOTEL`;

CREATE TABLE IF NOT EXISTS `Users` (
	`username` VARCHAR(255) NOT NULL,
	`password` CHAR(64) NOT NULL,
	`role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
	PRIMARY KEY (`username`)
);

CREATE TABLE IF NOT EXISTS `Rooms` (
	`id` INT NOT NULL,
	`capacity` INT NOT NULL DEFAULT 1,
	/* Price per night in euros */
	`price` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Reservations` (
	/* UUID */
	`id` CHAR(8) NOT NULL DEFAULT (SUBSTR(REPLACE(UUID(), '-', ''), 1, 8)),
	`room` INT NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(15) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`start` DATETIME NOT NULL,
	`end` DATETIME NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`room`) REFERENCES `Rooms`(`id`),
	CONSTRAINT `start_before_end` CHECK (`start` <  `end`)
);

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS `no_reservation_overlap`
BEFORE INSERT ON `Reservations`
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM `Reservations` AS r
        WHERE r.`room` = NEW.`room`
        AND r.`start` < NEW.`end`
        AND r.`end` > NEW.`start`
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Reservation overlaps with existing reservation';
    END IF;
END$$
DELIMITER ;