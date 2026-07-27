import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: "postgresql://postgres.yalsnkhxlfmojcarlgko:Lemadison16052007n@aws-0-eu-west-3.pooler.supabase.com:5432/postgres",
  },
})