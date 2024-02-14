import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import { isValidObjectId } from 'mongoose';

//!----------------------------------------------------------------------//

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body;

    try {
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            const error = new Error('El Proyecto no existe');
            return res.status(404).json({ msg: error.message })
        };

        if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('No tienes permisos para agregar tareas');
            return res.status(403).json({ msg: error.message })
        }

        try {
            const tareaAlmacenada = await Tarea.create(req.body);
            existeProyecto.tareas.push(tareaAlmacenada._id);
            await existeProyecto.save();
            res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({ msg: "ID no válido" });
        };

        return res.status(500).json({ msg: "Error del servidor" });
    }
};

//!----------------------------------------------------------------------//

const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            const error = new Error("ID no válido");
            return res.status(400).json({ msg: error.message });
        };

        const tarea = await Tarea.findById(id).populate('proyecto');

        if (!tarea) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ msg: error.message })
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Accion no valida');
            return res.status(403).json({ msg: error.message })
        };

        res.json(tarea);
    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({ msg: "ID no válido" });
        };

        return res.status(500).json({ msg: "Error del servidor" });
    }
};

//!----------------------------------------------------------------------//

const actualizarTarea = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            const error = new Error("ID no válido");
            return res.status(400).json({ msg: error.message });
        };

        const tarea = await Tarea.findById(id).populate('proyecto');

        if (!tarea) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ msg: error.message })
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Accion no valida');
            return res.status(403).json({ msg: error.message })
        };

        tarea.nombre = req.body.nombre || tarea.nombre;
        tarea.descripcion = req.body.descripcion || tarea.descripcion;
        tarea.prioridad = req.body.prioridad || tarea.prioridad;
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

        try {
            const tareaAlmacenada = await tarea.save();
            res.json(tareaAlmacenada);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({ msg: "ID no válido" });
        };

        return res.status(500).json({ msg: "Error del servidor" });
    };
};

//!----------------------------------------------------------------------//

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) {
            const error = new Error("ID no válido");
            return res.status(400).json({ msg: error.message });
        };

        const tarea = await Tarea.findById(id).populate('proyecto');

        if (!tarea) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ msg: error.message })
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error('Accion no valida');
            return res.status(403).json({ msg: error.message })
        };

        try {
            const proyecto = await Proyecto.findById(tarea.proyecto);
            proyecto.tareas.pull(tarea._id);
            await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
            res.json({ msg: "La Tarea se eliminó" });
          } catch (error) {
            console.log(error);
          }
        
    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({ msg: "ID no válido" });
        };

        return res.status(500).json({ msg: "Error del servidor" }); 
    }
};

//!----------------------------------------------------------------------//

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;

        const tarea = await Tarea.findById(id).populate("proyecto");

        if (!tarea) {
            const error = new Error("Tarea no encontrada");
            return res.status(404).json({ msg: error.message });
        }

        if (
            tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
            !tarea.proyecto.colaboradores.some(
                (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
            )
        ) {
            const error = new Error("Acción no válida");
            return res.status(403).json({ msg: error.message });
        }

        tarea.estado = !tarea.estado;
        tarea.completado = req.usuario._id;
        await tarea.save();

        const tareaAlmacenada = await Tarea.findById(id)
            .populate("proyecto")
            .populate("completado");

        res.json(tareaAlmacenada);
    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({ msg: "ID no válido" });
        };

        return res.status(500).json({ msg: "Error del servidor" });
    }
};

//!----------------------------------------------------------------------//

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}