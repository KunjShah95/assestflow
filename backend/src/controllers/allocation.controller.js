import * as allocationEngine from '../engines/allocation.engine.js';
import * as intelligenceEngine from '../engines/intelligence.engine.js';

export async function doAllocate(req, res, next) {
  try {
    const { assetId, employeeId, departmentId, expectedReturnDate } = req.body;
    const allocation = await allocationEngine.allocate(assetId, employeeId, departmentId, expectedReturnDate, req.user.id);
    const intelligence = await intelligenceEngine.generateAllocationReasoning(assetId, employeeId);
    res.status(201).json({ allocation, intelligence });
  } catch (err) { next(err); }
}

export async function doTransfer(req, res, next) {
  try {
    const { assetId, toEmployeeId, reason } = req.body;
    const result = await allocationEngine.requestTransfer(assetId, req.user.id, toEmployeeId, reason);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function approveTransfer(req, res, next) {
  try {
    const result = await allocationEngine.approveTransfer(parseInt(req.params.id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

export async function doReturn(req, res, next) {
  try {
    const { conditionNotes } = req.body;
    const result = await allocationEngine.returnAsset(parseInt(req.params.id), conditionNotes, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}
