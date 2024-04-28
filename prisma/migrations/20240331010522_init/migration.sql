-- CreateTable
CREATE TABLE "Candidate" (
    "cnd_id" SERIAL NOT NULL,
    "cnd_name" VARCHAR(50) NOT NULL DEFAULT 'Default Candidate',
    "cnd_applied_position" VARCHAR(100) NOT NULL,
    "cnd_experience" INTEGER NOT NULL DEFAULT 0,
    "resume_upload_status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "cnd_status" VARCHAR(50) NOT NULL DEFAULT 'Not Scheduled',
    "created_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_by" INTEGER NOT NULL DEFAULT 0,
    "modified_date" DATE,
    "modified_by" INTEGER,
    "employee_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("cnd_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "emp_id" SERIAL NOT NULL,
    "emp_name" VARCHAR(50) NOT NULL,
    "emp_position" VARCHAR(50) NOT NULL,
    "emp_username" VARCHAR(50) NOT NULL,
    "emp_password" VARCHAR(50) NOT NULL,
    "emp_status" VARCHAR(50) NOT NULL DEFAULT 'Idle',
    "emp_type" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_EMP_ID" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "eval_id" SERIAL NOT NULL,
    "total_avg_score" DECIMAL NOT NULL,
    "eval_notes" VARCHAR(300),
    "interview_id" INTEGER NOT NULL DEFAULT 0,
    "interviewer_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_EVAL_ID" PRIMARY KEY ("eval_id")
);

-- CreateTable
CREATE TABLE "Evaluation_Points" (
    "evaluation_id" INTEGER NOT NULL DEFAULT 0,
    "evalpt_id" INTEGER NOT NULL DEFAULT 0,
    "evalpt_status" VARCHAR(50) NOT NULL DEFAULT 'Not Scored',
    "evalpt_score" DECIMAL NOT NULL,

    CONSTRAINT "PK_EVAL_POINTS" PRIMARY KEY ("evaluation_id","evalpt_id")
);

-- CreateTable
CREATE TABLE "Evaluation_Points_Master" (
    "evalpt_id" SERIAL NOT NULL,
    "evalpt_type" VARCHAR(50) NOT NULL,
    "point" VARCHAR(300) NOT NULL,
    "position_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_POINT_ID" PRIMARY KEY ("evalpt_id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "int_id" SERIAL NOT NULL,
    "int_type" VARCHAR(50) NOT NULL,
    "int_date_time" DATE NOT NULL,
    "int_medium" VARCHAR(50) NOT NULL,
    "int_status" VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    "created_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_by" INTEGER NOT NULL DEFAULT 0,
    "modified_by" INTEGER,
    "candidate_id" INTEGER NOT NULL DEFAULT 0,
    "position_id" INTEGER NOT NULL DEFAULT 0,
    "modified_date" DATE,

    CONSTRAINT "PK_INTERVIEW_ID" PRIMARY KEY ("int_id")
);

-- CreateTable
CREATE TABLE "Interview_Assignment" (
    "inta_id" SERIAL NOT NULL,
    "created_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_by" INTEGER NOT NULL DEFAULT 0,
    "modified_date" DATE,
    "modified_by" INTEGER,
    "interviewer_id" INTEGER NOT NULL DEFAULT 0,
    "interview_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_ASIGN_ID" PRIMARY KEY ("inta_id")
);

-- CreateTable
CREATE TABLE "Job_Position_Master" (
    "pos_id" SERIAL NOT NULL,
    "pos_name" VARCHAR(100) NOT NULL,
    "pos_description" VARCHAR(300) NOT NULL,
    "pos_salary" DECIMAL,
    "pos_start_date" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "Job_Position_Master_pkey" PRIMARY KEY ("pos_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_USERNAME" ON "Employee"("emp_username");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "FK_EMP_ID" FOREIGN KEY ("employee_id") REFERENCES "Employee"("emp_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "FK_INTERVIEWER_ID" FOREIGN KEY ("interviewer_id") REFERENCES "Employee"("emp_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "FK_INTERVIEW_ID" FOREIGN KEY ("interview_id") REFERENCES "Interview"("int_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Evaluation_Points" ADD CONSTRAINT "FK_EVAL_ID" FOREIGN KEY ("evaluation_id") REFERENCES "Evaluation"("eval_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Evaluation_Points" ADD CONSTRAINT "FK_EVAL_PT_ID" FOREIGN KEY ("evalpt_id") REFERENCES "Evaluation_Points_Master"("evalpt_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Evaluation_Points_Master" ADD CONSTRAINT "FK_POSITION_ID" FOREIGN KEY ("position_id") REFERENCES "Job_Position_Master"("pos_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "FK_CANDIDATE_ID" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("cnd_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "FK_POSITION_ID" FOREIGN KEY ("position_id") REFERENCES "Job_Position_Master"("pos_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Interview_Assignment" ADD CONSTRAINT "FK_INTERVIEWER_ID" FOREIGN KEY ("interviewer_id") REFERENCES "Employee"("emp_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Interview_Assignment" ADD CONSTRAINT "FK_INTERVIEW_ID" FOREIGN KEY ("interview_id") REFERENCES "Interview"("int_id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;
