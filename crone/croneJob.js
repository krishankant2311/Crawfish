const cron = require('node-cron');
const User = require('../module/user/model/userModel');

function startDeleteOldUsersJob() {
  cron.schedule('0 0 * * *', async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const result = await User.deleteMany({
      status: 'delete',
      updatedAt: { $lte: cutoffDate }
    });

    console.log(`Deleted ${result.deletedCount} old users`);
  });
}

module.exports = startDeleteOldUsersJob;



// const cron = require('node-cron');
// // const User = require('../models/User');
// function startDeleteOldUsersJob() {
// cron.schedule('*/1 * * * *', async () => {
//   const cutoff = new Date(Date.now() - 60 * 1000); // 1 min old

//   const result = await User.deleteMany({
//     status: 'Delete',
//     updatedAt: { $lt: cutoff },
//   });

//   console.log(`${result.deletedCount} users deleted permanently`);
// });
// }
// module.exports = startDeleteOldUsersJob;