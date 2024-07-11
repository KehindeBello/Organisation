import { Router } from "express";
import { OrganisationController } from "../controllers/organisationController";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validate";
import { organisationSchema } from "../schemas/organisationSchema";

const router = Router()
const organisationController = new OrganisationController()

router.post('/organisations', protectRoute, validateSchema(organisationSchema), organisationController.create_organisation)
router.get('/organisations/:orgId?', protectRoute, organisationController.get_Organisation)
router.post('/organisations/:orgId/users', organisationController.addUser)

export const OrganisationRouter = router;