create database chat_gpt;
use chat_gpt;

CREATE TABLE IF NOT EXISTS `chat_gpt` (
    `id` INT auto_increment NOT NULL,
    `public_id` VARCHAR(45) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `tokens` INT NOT NULL DEFAULT 0,
    `query` TEXT NOT NULL,
    `content` TEXT NULL,
    `executed_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `public_id_UNIQUE` (`public_id` ASC) VISIBLE)