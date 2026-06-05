const prisma = require("../../config/db");

exports.create = async (data) => {
  return prisma.template.create({
    data,
  });
};

exports.findAll = async () => {
  return prisma.template.findMany();
};

exports.findById = async (id) => {
  return prisma.template.findUnique({
    where: { id },
  });
};

exports.update = async (id, data) => {
  return prisma.template.update({
    where: { id },
    data,
  });
};

exports.remove = async (id) => {
  return prisma.template.delete({
    where: { id },
  });
};