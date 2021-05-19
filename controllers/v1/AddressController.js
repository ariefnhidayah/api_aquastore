const { Address, Province, City, District } = require("../../models");
const Validator = require("fastest-validator");
const validator = new Validator();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

Province.hasMany(Address, {
  foreignKey: 'province_id',
})

Address.belongsTo(Province, {
  foreignKey: 'province_id'
})

City.hasMany(Address, {
  foreignKey: 'city_id'
})

Address.belongsTo(City, {
  foreignKey: 'city_id'
})

District.hasMany(Address, {
  foreignKey: 'district_id',
})

Address.belongsTo(District, {
  foreignKey: 'district_id'
})

module.exports = {
  add: async (req, res) => {
    const schema = {
      title: "string|empty:false",
      name: "string|empty:false",
      phone: "string|empty:false",
      address: "string|empty:false",
      city_id: "number|empty:false",
      province_id: "number|empty:false",
      district_id: "number|empty:false",
      postcode: "string|empty:false",
    };

    const validate = validator.validate(req.body, schema);
    if (validate.length > 0) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    } else {
      const user = req.user.data;

      const {
        title,
        name,
        phone,
        address,
        city_id,
        province_id,
        district_id,
        postcode,
      } = req.body;

      // check primary address for this user
      const primaryAddress = await Address.findOne({
        where: {
          user_id: user.id,
          primary: 1,
        },
      });
      let primary = 0;
      if (primaryAddress) {
        primary = 0;
      } else {
        primary = 1;
      }

      const data = {
        user_id: user.id,
        title,
        name,
        phone,
        address,
        city_id,
        province_id,
        district_id,
        postcode,
        primary,
      };

      await Address.create(data);

      return res.json({
        status: "success",
        message: "Address added successfully!",
      });
    }
  },
  update: async (req, res) => {
    const schema = {
      title: "string|empty:false",
      name: "string|empty:false",
      phone: "string|empty:false",
      address: "string|empty:false",
      city_id: "number|empty:false",
      province_id: "number|empty:false",
      district_id: "number|empty:false",
      postcode: "string|empty:false",
    };

    const validate = validator.validate(req.body, schema);
    if (validate.length > 0) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    } else {
      const user = req.user.data;
      const id = req.params.id;

      // const { primary } = req.body;

      const dataAddress = await Address.findByPk(id);

      if (dataAddress) {
        // if (primary == 1) {
        //   await Address.update(
        //     {
        //       primary: 0,
        //     },
        //     {
        //       where: {
        //         user_id: user.id,
        //       },
        //     }
        //   );
        // } else {
        //   const checkPrimary = await Address.findOne({
        //     where: {
        //       user_id: user.id,
        //       primary: 1,
        //       id: {
        //         [Op.ne]: id,
        //       },
        //     },
        //   });
        //   if (!checkPrimary) {
        //     return res.status(400).json({
        //       status: "error",
        //       message: "Minimum primary address 1",
        //     });
        //   }
        // }
        await dataAddress.update(req.body);
        return res.json({
          status: "success",
          message: "Update address successfully!",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Address not found!",
        });
      }
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    const user = req.user.data;
    const address = await Address.findByPk(id);
    if (address) {
      if (address.primary) {
        const userAddress = await Address.findOne({
          where: {
            user_id: user.id,
            id: {
              [Op.ne]: id,
            },
          },
        });
        if (userAddress) {
          await userAddress.update({
            primary: 1,
          });
        }
      }
      await address.destroy();
      return res.json({
        status: "success",
        message: "Address deleted!",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Address not found!",
      });
    }
  },
  get_list: async (req, res) => {
    const user = req.user.data
    const addresses = await Address.findAll({
      where: {
        user_id: user.id
      },
      include: [
        {
          model: Province,
          attributes: ['name']
        },
        {
          model: City,
          attributes: ['type', 'name']
        },
        {
          model: District,
          attributes: ['name']
        }
      ],
      attributes: ['id', 'title', 'name', 'phone', 'address', 'postcode', 'primary', 'city_id', 'district_id', 'province_id']
    })
    return res.json({
      status: 'success',
      data: addresses ? addresses : []
    })
  },
  get: async (req, res) => {
    const user = req.user.data
    const id = req.params.id
    let address
    if (id == 'primary') {
      address = await Address.findAll({
        where: {
          user_id: user.id,
          primary: 1
        },
        include: [
          {
            model: Province,
            attributes: ['name']
          },
          {
            model: City,
            attributes: ['type', 'name']
          },
          {
            model: District,
            attributes: ['name']
          }
        ],
        attributes: ['id', 'title', 'name', 'phone', 'address', 'postcode', 'primary', 'city_id', 'district_id', 'province_id']
      })
    } else {
      address = await Address.findOne({
        where: {
          user_id: user.id,
          id
        },
        include: [
          {
            model: Province,
            attributes: ['name']
          },
          {
            model: City,
            attributes: ['type', 'name']
          },
          {
            model: District,
            attributes: ['name']
          }
        ],
        attributes: ['id', 'title', 'name', 'phone', 'address', 'postcode', 'primary']
      })
    }

    if (address) {
      return res.json({
        status: 'success',
        data: address.length > 0 ? address[0] : {}
      })
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found!'
      })
    }
  },
  provincies: async(req, res) => {
    const provincies = await Province.findAll({
      attributes: ['name', 'id']
    });
    return res.json({
      status: 'success',
      data: provincies
    })
  },
  cities: async (req, res) => {
    const province_id = req.query.province
    const cities = await City.findAll({
      where: {
        province: province_id
      },
      attributes: ['id', 'type', 'name']
    })
    return res.json({
      status: 'success',
      data: cities
    })
  },
  districts: async (req, res) => {
    const city_id = req.query.city
    const districts = await District.findAll({
      where: {
        city: city_id
      },
      attributes: ['id', 'name']
    })
    return res.json({
      status: 'success',
      data: districts
    })
  },
  change_address: async (req, res) => {
    const user = req.user.data
    const id = req.params.id
    await Address.update({
      primary: 0
    }, {
      where: {
        user_id: user.id
      }
    })

    await Address.update({
      primary: 1
    }, {
      where: {
        id: id
      }
    })
    return res.json({
      status:"success",
      message: "Alamat berhasil diubah!"
    })
  }
};
