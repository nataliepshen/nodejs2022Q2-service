-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "favoritesId" UUID;

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "favoritesId" UUID;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "favoritesId" UUID;

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
