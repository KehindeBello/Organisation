import { Router } from "express";
import { OrganisationController } from "../controllers/organisationController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router()
const organisationController = new OrganisationController()

router.post('/organisations', protectRoute, organisationController.create_organisation)
router.get('/organisations/:orgId?', protectRoute, organisationController.get_Organisation)

export const OrganisationRouter = router;