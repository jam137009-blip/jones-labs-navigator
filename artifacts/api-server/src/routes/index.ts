import { Router, type IRouter } from "express";
import healthRouter from "./health";
import navigateRouter from "./navigate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(navigateRouter);

export default router;
