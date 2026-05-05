const Shipment = require('../../models/Shipment')

exports.getAll = async (userId) => {
  // ✅ FIX N+1 using populate
  return await Shipment.find({ userId }).populate('userId', '-password')
}

exports.getOne = async (id, userId, role) => {
  const shipment = await Shipment.findById(id)

  if (!shipment) throw new Error('Not found')

  if (shipment.userId.toString() !== userId && role !== 'admin') {
    throw new Error('No access')
  }

  return shipment
}

exports.create = async (data, userId) => {
  const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 1000)

  return await Shipment.create({
    ...data,
    trackingId: trackId,
    userId,
    status: 'pending'
  })
}

exports.updateStatus = async (id, status, userId, role) => {
  const shipment = await Shipment.findById(id)

  if (!shipment) {
    throw new Error('Not found')
  }

  if (shipment.userId.toString() !== userId && role !== 'admin') {
    throw new Error('No access')
  }

  if (status === 'delivered' && role !== 'admin') {
    throw new Error('Admins only')
  }

  return await Shipment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
}

exports.delete = async (id, userId) => {
  const shipment = await Shipment.findById(id)

  if (!shipment) throw new Error('Not found')

  if (shipment.userId.toString() !== userId) {
    throw new Error('Unauthorized delete')
  }

  await Shipment.findByIdAndDelete(id)

  return { message: 'Deleted successfully' }
}