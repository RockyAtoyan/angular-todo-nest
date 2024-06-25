-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "order" SERIAL NOT NULL;
