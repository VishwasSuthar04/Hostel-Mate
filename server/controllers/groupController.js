const Group = require('../models/Group')
const User = require('../models/User')

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ $or: [{ createdBy: req.user._id }, { members: req.user._id }] })
      .populate('members', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
    res.json({ groups })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name')
    if (!group) return res.status(404).json({ message: 'Group not found' })
    res.json({ group })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body
    const group = await Group.create({ name, description, createdBy: req.user._id, members: [req.user._id] })
    await group.populate('members', 'name email')
    await group.populate('createdBy', 'name')
    res.status(201).json({ group })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body
    const group = await Group.findById(groupId)
    if (!group) return res.status(404).json({ message: 'Group not found' })
    if (group.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' })
    group.members.push(req.user._id)
    await group.save()
    await group.populate('members', 'name email')
    await group.populate('createdBy', 'name')
    res.json({ group })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body
    const group = await Group.findById(req.params.id)
    if (!group) return res.status(404).json({ message: 'Group not found' })
    const invitedUser = await User.findOne({ email })
    if (!invitedUser) return res.status(404).json({ message: 'User not found with that email' })
    if (group.members.includes(invitedUser._id)) return res.status(400).json({ message: 'Already a member' })
    group.members.push(invitedUser._id)
    await group.save()
    await group.populate('members', 'name email')
    await group.populate('createdBy', 'name')
    res.json({ group, message: `${invitedUser.name} added to group` })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
    if (!group) return res.status(404).json({ message: 'Group not found' })
    group.members = group.members.filter(m => m.toString() !== req.user._id.toString())
    await group.save()
    res.json({ message: 'Left the group' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
