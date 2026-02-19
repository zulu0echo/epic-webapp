-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "definition" TEXT DEFAULT '',
    "summary" TEXT DEFAULT '',
    "challenges" TEXT DEFAULT '',
    "opportunities" TEXT DEFAULT '',
    "ethereumPrimitives" TEXT DEFAULT '',
    "valueProposition" TEXT DEFAULT '',
    "relatedLinks" TEXT DEFAULT '',
    "maturityLevel" TEXT DEFAULT 'idea',
    "tags" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainEdge" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "edgeType" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "description" TEXT DEFAULT '',
    "outcomes" TEXT DEFAULT '',
    "links" TEXT DEFAULT '',
    "blockchainUsed" TEXT DEFAULT '',
    "architectureNotes" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentDomain" (
    "domainId" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,

    CONSTRAINT "ExperimentDomain_pkey" PRIMARY KEY ("domainId","experimentId")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT DEFAULT '',
    "region" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "alignmentNotes" TEXT DEFAULT '',
    "relationshipOwner" TEXT DEFAULT '',
    "status" TEXT DEFAULT 'prospect',
    "tags" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
    "handles" TEXT DEFAULT '',
    "geography" TEXT DEFAULT '',
    "languages" TEXT DEFAULT '',
    "championFlag" BOOLEAN NOT NULL DEFAULT false,
    "championNotes" TEXT DEFAULT '',
    "influenceLevel" TEXT DEFAULT '',
    "valuesAlignment" TEXT DEFAULT '',
    "lastContactedAt" TIMESTAMP(3),
    "notes" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "stage" TEXT NOT NULL DEFAULT 'long_list',
    "priority" TEXT DEFAULT 'med',
    "fitScore" INTEGER,
    "riskNotes" TEXT DEFAULT '',
    "budgetBand" TEXT DEFAULT '',
    "nextStep" TEXT DEFAULT '',
    "dueDate" TIMESTAMP(3),
    "pocFlagshipFlag" BOOLEAN NOT NULL DEFAULT false,
    "links" TEXT DEFAULT '',
    "notesTimeline" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityInstitution" (
    "opportunityId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "OpportunityInstitution_pkey" PRIMARY KEY ("opportunityId","institutionId")
);

-- CreateTable
CREATE TABLE "OpportunityDomain" (
    "opportunityId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "OpportunityDomain_pkey" PRIMARY KEY ("opportunityId","domainId")
);

-- CreateTable
CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "affiliation" TEXT DEFAULT '',
    "expertiseDomains" TEXT DEFAULT '',
    "skillsTags" TEXT DEFAULT '',
    "region" TEXT DEFAULT '',
    "languages" TEXT DEFAULT '',
    "ethereumAlignmentNotes" TEXT DEFAULT '',
    "conflicts" TEXT DEFAULT '',
    "availability" TEXT DEFAULT '',
    "contactPath" TEXT DEFAULT '',
    "referencesLinks" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpertDomain" (
    "expertId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "ExpertDomain_pkey" PRIMARY KEY ("expertId","domainId")
);

-- CreateTable
CREATE TABLE "Coalition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "memberships" TEXT DEFAULT '',
    "links" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coalition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT DEFAULT '',
    "date" TIMESTAMP(3),
    "description" TEXT DEFAULT '',
    "links" TEXT DEFAULT '',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityNote" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "noteType" TEXT DEFAULT 'note',
    "opportunityId" TEXT,
    "contactId" TEXT,
    "institutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT DEFAULT '',

    CONSTRAINT "ActivityNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DomainEdge_fromId_idx" ON "DomainEdge"("fromId");

-- CreateIndex
CREATE INDEX "DomainEdge_toId_idx" ON "DomainEdge"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainEdge_fromId_toId_edgeType_key" ON "DomainEdge"("fromId", "toId", "edgeType");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainEdge" ADD CONSTRAINT "DomainEdge_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainEdge" ADD CONSTRAINT "DomainEdge_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentDomain" ADD CONSTRAINT "ExperimentDomain_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentDomain" ADD CONSTRAINT "ExperimentDomain_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityInstitution" ADD CONSTRAINT "OpportunityInstitution_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityInstitution" ADD CONSTRAINT "OpportunityInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityDomain" ADD CONSTRAINT "OpportunityDomain_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityDomain" ADD CONSTRAINT "OpportunityDomain_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertDomain" ADD CONSTRAINT "ExpertDomain_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertDomain" ADD CONSTRAINT "ExpertDomain_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityNote" ADD CONSTRAINT "ActivityNote_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityNote" ADD CONSTRAINT "ActivityNote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
