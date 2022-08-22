const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeeSchemaValidator = require('../models/employee/schemaValidator');
const mappersEmployee = require('../models/employee/mapperEmployee');

const employeesRepository = require('../repositories/employee/employeesRepository');


const logger = require('../logger/logger');

const createServiceErrors = require('./errors/createServiceErrors');
const positionService = require('./positionService');
const departmentService = require('./departmentService');




employeesService.getAll = async function () {
    try {

        const resultGetAll = await employeesRepository.getAll();

        const mappingData = mappersEmployee.restructureEmployeeData(resultGetAll.data);

        resultGetAll.data = mappingData;
        logger.info('The result data is received')

        return resultGetAll;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err);

    }

}

employeesService.getById = async function (employeeId) {
    try {

        const validatesId = validator.isNumber(employeeId);

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const resultGetById = await employeesRepository.getById(employeeId);
        if(resultGetById.success){

            const mappingData = mappersEmployee.restructureEmployeeData(resultGetById.data);
            resultGetById.data = mappingData[0];

        }
        

        return await resultGetById;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err)

    }
}

employeesService.createNewEmployee = async function (employeeData) {
    try {
        const resultValidationData = employeeSchemaValidator.validateSchema(employeeData);

        if (resultValidationData.error) {
            return createServiceErrors.invalidData(resultValidationData.error);
        }

        const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
        return resultCreateNewEmployee;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.assignOrUpdatePosition = async function (employeeId, positionData) {
    try {

        const validatesId = validator.isNumber(employeeId);
        const validatesPositionData = employeeSchemaValidator.positionAssignmentSchema(positionData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error.details[0]);

        }

        if (validatesPositionData.error) {

            return createServiceErrors.invalidData(validatesPositionData.error.details[0]);

        }

        const positionSearch = await positionService.getById(positionData.position);
        const employeeSearch = await employeesService.getById(employeeId);

        if (positionSearch.success === false) {

            return positionSearch;

        }

        if (employeeSearch.success === false) {

            return employeeSearch

        }

        if (employeeSearch.data.position === null) {

            const resultAssignPosition = await employeesRepository.assignDepartment(employeeId, positionData);
            return resultAssignPosition;

        }

        const currentPosition = employeeSearch.data.position.id;
        const updatePositionResult = await employeesRepository.updateDepartment(employeeId, positionData, currentPosition)

        return updatePositionResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.assignOrUpdateDepartment = async function (employeeId, departmentData) {
    try {

        const validatesId = validator.isNumber(employeeId);
        const validatesDepartmentData = employeeSchemaValidator.departmentAssignmentSchema(departmentData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error.details[0]);

        }

        if (validatesDepartmentData.error) {

            return createServiceErrors.invalidData(validatesDepartmentData.error.details[0]);

        }


        

        if (employeeSearch.data.department === null) {

            const resultAssignDepartment = await employeesRepository.assignDepartment(employeeId, departmentData);
            return resultAssignDepartment;

        }

        const currentDepartment = employeeSearch.data.department.id;
        const updateDepartmentResult = await employeesRepository.updateDepartment(employeeId, departmentData, currentDepartment)

        return updateDepartmentResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}


employeesService.updateById = async function (employeeId, employeeData) {

    try {
        const validatesId = validator.isNumber(employeeId);

        const resultValidationData = employeeSchemaValidator.validateSchema(employeeData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error);

        } else if (resultValidationData.error) {
            return createServiceErrors.invalidData(resultValidationData.error);
        }

        const UpdateByIdResult = employeesRepository.updateById(employeeId, employeeData)

        return UpdateByIdResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.deleteById = async function (employeeId) {
    try {

        const validatesId = validator.isNumber(employeeId);

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }


        const UpdateByIdResult = await employeesRepository.deleteById(employeeId);
        return UpdateByIdResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err);

    }

}



module.exports = employeesService;
