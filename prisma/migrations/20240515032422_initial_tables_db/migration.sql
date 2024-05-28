-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `departments_id_key`(`id`),
    UNIQUE INDEX `departments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `profiles_id_key`(`id`),
    UNIQUE INDEX `profiles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `user_code` INTEGER NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `department_id` INTEGER NOT NULL,
    `profile_id` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `avatar` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_user_code_key`(`user_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `profiles` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `profile_permissions_id_key`(`id`),
    UNIQUE INDEX `profile_permissions_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `categories_id_key`(`id`),
    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `products_id_key`(`id`),
    UNIQUE INDEX `products_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `payments_id_key`(`id`),
    UNIQUE INDEX `payments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` DECIMAL(10, 2) NOT NULL,
    `payment_id` INTEGER NOT NULL,
    `sale_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `sales_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_relationship_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `amount_product` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `sales_relationship_product_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales_relationship_product` ADD CONSTRAINT `sales_relationship_product_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales_relationship_product` ADD CONSTRAINT `sales_relationship_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
