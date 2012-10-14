/******************************************************************************
Description: This is a basic "life" simulation that follows three distinct rules:
1.Any live cell with fewer than two live neighbours dies
2.Any live cell with two or three live neighbours lives
3.Any live cell with more than three live neighbours dies
4.Any dead cell with exactly three live neighbours becomes a live cell
A neighbor is deemed as any cell directly horizantal/vertical/diagonal
meaning there are 8 neighbors to a cell at any time
******************************************************************************/

var life_matrix, pop_x, pop_y;
pop_x = 15;
pop_y = 15;

var get_random_color = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

var render_table = function (life_matrix) {
    var life_table = $('#table');
    life_table.empty();
    for (var i = 0; i < life_matrix.length; i++) {
        life_table.append('<tr id="row_' + i + '"></tr>');
        for (var j = 0; j < life_matrix[i].length; j++) {
            curr_class = life_matrix[i][j] == 1 ? 'alive' : 'dead';
            if (curr_class === 'alive') {
                $('#row_' + i).append('<td id="' + i +',' + j + '" class="cell ' + curr_class + '" style="background-color: ' + get_random_color() + ';">' + '</td>');
            } else {
                $('#row_' + i).append('<td id="' + i +',' + j + '" class="cell ' + curr_class + '">' + '</td>');
            }
        }
    }
}

var get_neighbours = function (cell_x, cell_y) {
    var sum = 0;
    if (-1 < cell_x + 1 && cell_x + 1 < pop_x && -1 < cell_y + 1 && cell_y + 1 < pop_y) {
        sum += life_matrix[cell_x + 1][cell_y + 1];
    }
    if (-1 < cell_x + 1 && cell_x + 1 < pop_x && -1 < cell_y + 0 && cell_y + 0 < pop_y) {
        sum += life_matrix[cell_x + 1][cell_y + 0];
    }
    if (-1 < cell_x + 0 && cell_x + 0 < pop_x && -1 < cell_y + 1 && cell_y + 1 < pop_y) {
        sum += life_matrix[cell_x + 0][cell_y + 1];
    }
    if (-1 < cell_x + 1 && cell_x + 1 < pop_x && -1 < cell_y - 1 && cell_y - 1 < pop_y) {
        sum += life_matrix[cell_x + 1][cell_y - 1];
    }
    if (-1 < cell_x - 1 && cell_x - 1 < pop_x && -1 < cell_y + 1 && cell_y + 1 < pop_y) {
        sum += life_matrix[cell_x - 1][cell_y + 1];
    }
    if (-1 < cell_x - 1 && cell_x - 1 < pop_x && -1 < cell_y - 1 && cell_y - 1 < pop_y) {
        sum += life_matrix[cell_x - 1][cell_y - 1];
    }
    if (-1 < cell_x - 1 && cell_x - 1 < pop_x && -1 < cell_y + 0 && cell_y + 0 < pop_y) {
        sum += life_matrix[cell_x - 1][cell_y + 0];
    }
    if (-1 < cell_x + 0 && cell_x + 0 < pop_x && -1 < cell_y - 1 && cell_y - 1 < pop_y) {
        sum += life_matrix[cell_x + 0][cell_y - 1];
    }
    return sum;
}

var advance_generation = function (life_matrix) {
    var new_generation = [];
    for (var i = 0; i < life_matrix.length; i++) {
        new_row = []
        for (var j =0; j < life_matrix[i].length; j++) {
            curr_cell = life_matrix[i][j];
            neighbour_sum = get_neighbours(i, j);
            if (curr_cell === 1 && neighbour_sum < 2) {
                new_row.push(0);
            } else if (curr_cell === 1 && (neighbour_sum === 2 || neighbour_sum === 3)) {
                new_row.push(1);
            } else if (curr_cell === 1 && neighbour_sum > 3) {
                new_row.push(0);
            } else if (curr_cell === 0 && neighbour_sum === 3) {
                new_row.push(1);
            } else {
                new_row.push(0);
            }
        }
        new_generation.push(new_row);
    }
    return new_generation;
}

var update_matrix = function () {
}

var initialise_life = function (x, y) {
    life_matrix = [];
    for (var i = 0; i < x; i++) {
        var row = [];
        for (var j = 0; j < y; j++) {
            row.push(0);
        }
        life_matrix.push(row);
    }
}

var sum_life = function (life_matrix) {
    var sum = 0;
    for (var i = 0; i < life_matrix.length; i++) {
        for (var j = 0; j < life_matrix[i].length; j++) {
            sum += life_matrix[i][j];
        }
    }
    return sum;
}

var start_life = function () {
    if (sum_life(life_matrix) > 0) {
        var new_generation = advance_generation(life_matrix);
        if (life_matrix.toString() === new_generation.toString()) {
            console.log('We are done!');
        }
        life_matrix = new_generation;
        render_table(life_matrix);
    }
}

$(document).ready(function () {
    initialise_life(pop_x, pop_y);
    render_table(life_matrix);
    $('#table').on('click', '.cell', function () {
        var cell_pos = $(this).attr('id').split(',');
        if ($(this).hasClass('alive')) {
            $(this).removeClass('alive').addClass('dead');
            life_matrix[cell_pos[0]][cell_pos[1]] = 0;
        } else if ($(this).hasClass('dead')) {
            $(this).removeClass('dead').addClass('alive');
            life_matrix[cell_pos[0]][cell_pos[1]] = 1;
        }
    });

    $('#start_life').click(function () {
        //update_matrix();
        start_life();
    });

    $('#reset_life').click(function () {
        initialise_life(pop_x, pop_y);
        render_table(life_matrix);
    });

    $('#random_life').click(function () {
        for (var i = 0; i < life_matrix.length; i++) {
            for (var j = 0; j < life_matrix[i].length; j++) {
                if (Math.random() > 0.5) {
                    life_matrix[i][j] = 1;
                } else {
                    life_matrix[i][j] = 0;
                }
            }
        }
        render_table(life_matrix);
    });

    $('#pop_x').change(function () {
        $('#pop_x_val').html($(this).val());
        pop_x = $(this).val();
        initialise_life(pop_x, pop_y);
        render_table(life_matrix);
    });

    $('#pop_y').change(function () {
        $('#pop_y_val').html($(this).val());
        pop_y = $(this).val();
        initialise_life(pop_x, pop_y);
        render_table(life_matrix);
    });

    $('.open-menu').click(function () {
        if ($('.open-menu').html() === '+') {
            $('.open-menu').html('-');
            $('.size-controls').show();
        } else {
            $('.open-menu').html('+');
            $('.size-controls').hide();
        }
    });
});
