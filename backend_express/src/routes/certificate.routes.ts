import { Router } from 'express';
import { issueCertificate, verifyCertificate, getCertificates } from '../controllers/certificate.controller';

const router = Router();

router.get('/', getCertificates); // Added route for list
router.post('/issue', issueCertificate);
router.get('/verify/:id', verifyCertificate);

export default router;
