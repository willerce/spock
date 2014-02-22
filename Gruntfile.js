module.exports = function(grunt) {
  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './builds', 
        mac: true, 
        win: true, 
        linux32: false, 
        linux64: false
      },
      src: ['./src/**/*'] 
    },
  });
  
  grunt.loadNpmTasks('grunt-node-webkit-builder');
}