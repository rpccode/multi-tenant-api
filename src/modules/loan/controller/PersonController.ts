import { Request, Response } from "express";
import { CreateMultiplePerson, createPerson, updatePerson } from "../services/PersonService";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreatePersonDto } from "../class/dtos/person/CreatePersonDto";
import { UpdatePersonDto } from "../class/dtos/person/UpdatePersonDto";


export const CreatePerson = async (req: Request, res: Response) => {
  const createPersonDto = plainToClass(CreatePersonDto, req.body);
  const errors = await validate(createPersonDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const tenantuser = res.locals.tenant;

  try {
    await createPerson(tenantuser, createPersonDto);
    res.status(201).send({
      ok: true,
      message: "Persona creada exitosamente",
      person: createPersonDto,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Hubo un error al crear la persona",
      error,
    });
  }
};

export const updatePersona =async (req, res) => {
  const { id } = req.params;
  const persona = plainToClass(UpdatePersonDto, req.body);
  const errors = await validate(persona);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const tenantuser = res.locals.tenant;
  try {
    await updatePerson(tenantuser, persona,id);
    res.status(200).send({
      ok: true,
      message: "Persona actualizada exitosamente",
      persona: persona,
    });
    
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Hubo un error al actualizar la persona",
      error,
    });
    
  }
}

export const deletePersona = async (req, res) => {
  const { id } = req.params;
  const tenantuser = res.locals.tenant;
  try {
    await deletePersona(tenantuser, id);
    res.status(200).send({
      ok: true,
      message: "Persona eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Hubo un error al eliminar la persona",
      error,
    });
  }
}

export const CreateMultiplePersona = async (req, res) => {
  const personas = req.body;
  const tenantuser = res.locals.tenant;
  try {
    await CreateMultiplePerson(tenantuser, personas);

    res.status(201).send({
      ok: true,
      message: "Personas creadas exitosamente",
      personas: personas,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Hubo un error al crear las personas",
      error,
    });
  }
};

export const udateMultiplePersons = async (req: Request, res: Response) => {
    const personas = req.body;
    const tenantuser = res.locals.tenant;
    try {
      await udateMultiplePersons(tenantuser, personas);
      res.status(200).send({
        ok: true,
        message: "Personas actualizadas exitosamente",
        personas,
      });
    } catch (error) {
      res.status(500).send({
        ok: false,
        message: "Hubo un error al actualizar las personas",
        error: error instanceof Error ? error.message : error,
      });
    }
  
}

// export const getPersons = async (req, res) => {
//     const tenantuser = res.locals.tenant;
//     try {
//       const persons = await getPersons(tenantuser);
//       res.status(200).send(persons);
//     } catch (error) {
//       res.status(500).send("Hubo un error al obtener las personas");
//     }
// }